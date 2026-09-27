'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Text, View } from 'react-native-web';
import { Button, Empty, Spin, Upload, UploadProps } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownloadOutlined,
  UploadOutlined,
} from '@components/AppIcon';
import dayjs from 'dayjs';
import { useAppSelector } from '@redux';
import { messageApi } from '@hooks';
import api from '@services/api';
import { dashboardQuery } from '~mdDashboard/redux';
import {
  PracticeSubmitResponse,
  PracticeSubmissionResultItem,
  PRACTICE_CRITERIA_LABELS,
  PracticeCriteria,
} from '~mdDashboard/types/practice';
import CommentSection from '@components/CommentSection';
import BookmarkButton from '@components/BookmarkButton';
import { useResponsive } from '@/styles/responsive';
import { asButton } from '@/utils/asButton';
import {
  buildCellWindow,
  readWorkbook,
  type CellWindowResult,
} from '@/utils/practiceCellPreview';
import type { WorkBook } from 'xlsx';
import { typography } from '@styles';
import styles from './styles';

type Props = {
  taskId: string;
  onPassed?: () => void;
  mockExamAttemptId?: string;
  onSubmitted?: () => void;
};

const toScore10 = (total: number, max: number) =>
  max ? Number(((total / max) * 10).toFixed(1)) : 0;

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const PracticeTaskContent: React.FC<Props> = ({
  taskId,
  onPassed,
  mockExamAttemptId,
  onSubmitted,
}) => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const accessToken = useAppSelector(
    state => state.authReducer.tokenInfo?.accessToken,
  );
  const [latestResult, setLatestResult] =
    useState<PracticeSubmitResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'task' | 'fix'>('task');
  const [expandedCriteriaId, setExpandedCriteriaId] = useState<string | null>(
    null,
  );
  const [selectedCells, setSelectedCells] = useState<Record<string, string>>(
    {},
  );

  // Trạng thái đọc file .xlsx bài làm của học viên bằng SheetJS
  const [workbook, setWorkbook] = useState<WorkBook | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileReadError, setFileReadError] = useState<string | null>(null);

  const {
    data: detail,
    isFetching,
    error: detailError,
  } = dashboardQuery.useGetPracticeTaskDetailStudentQuery(
    { taskId, mockExamAttemptId },
    { skip: !taskId },
  );
  const { data: submissions, refetch: refetchSubmissions } =
    dashboardQuery.useGetMyPracticeSubmissionsQuery(taskId, {
      skip: !taskId || !!mockExamAttemptId,
    });
  const { data: instructions } =
    dashboardQuery.useGetPracticeTaskInstructionsQuery(taskId, {
      skip: !taskId,
    });
  const { data: bookmarkedTaskIds } =
    dashboardQuery.useGetBookmarkIdsQuery('practiceTask');

  const [lastTaskId, setLastTaskId] = useState(taskId);
  if (taskId !== lastTaskId) {
    setLastTaskId(taskId);
    setLatestResult(null);
    setActiveTab('task');
    setExpandedCriteriaId(null);
    setWorkbook(null);
    setFileReadError(null);
  }

  // Kết quả chấm từ lần nộp mới nhất trong phiên hoặc lịch sử nộp bài gần nhất
  const currentResult = useMemo(() => {
    if (latestResult) return latestResult;
    if (submissions && submissions.length > 0 && !mockExamAttemptId) {
      const last = submissions[0];
      return {
        submissionId: last._id,
        totalScore: last.totalScore,
        maxScore: last.maxScore,
        isPass: last.totalScore / (last.maxScore || 1) >= 0.8,
        items: last.results || [],
      } as PracticeSubmitResponse;
    }
    return null;
  }, [latestResult, submissions, mockExamAttemptId]);

  const isGraded = Boolean(currentResult && !mockExamAttemptId);
  const isMockExam = !!mockExamAttemptId;

  // Tự động đọc file .xlsx bài làm khi có submissionId và là môn Excel
  useEffect(() => {
    const subId = currentResult?.submissionId;
    if (!subId || detail?.task?.subject !== 'Excel') {
      setIsReadingFile(false);
      return;
    }

    let isMounted = true;
    setIsReadingFile(true);
    setFileReadError(null);

    const controller = new AbortController();
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        controller.abort();
        setIsReadingFile(false);
        setWorkbook(null);
        setFileReadError(
          'Không thể đọc file bài làm (quá thời gian xử lý hoặc file không đúng định dạng .xlsx).',
        );
      }
    }, 4000);

    api
      .get(`/practice/submissions/${subId}/file`, {
        responseType: 'blob',
        signal: controller.signal,
        timeout: 4000,
      })
      .then(async res => {
        if (
          res.data &&
          res.data.type &&
          res.data.type.includes('application/json')
        ) {
          throw new Error('Dữ liệu trả về không phải file Excel');
        }
        return readWorkbook(res.data);
      })
      .then(wb => {
        if (isMounted) {
          setWorkbook(wb);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setWorkbook(null);
          const msg =
            err?.message || 'Không mở được file bài làm để xem trước vùng ô.';
          setFileReadError(
            typeof msg === 'string' && msg.includes('trang tính')
              ? msg
              : 'Không mở được file bài làm (file bị lỗi hoặc không đúng định dạng .xlsx).',
          );
        }
      })
      .finally(() => {
        clearTimeout(safetyTimer);
        if (isMounted) {
          setIsReadingFile(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      controller.abort();
    };
  }, [currentResult?.submissionId, detail?.task?.subject]);

  // Tự động mở tiêu chí chưa đạt đầu tiên khi đã chấm điểm (theo đặc tả ExamRoom v2)
  useEffect(() => {
    if (!isGraded || !detail?.criteria || expandedCriteriaId !== null) return;
    const itemsMap = new Map<string, PracticeSubmissionResultItem>();
    currentResult?.items?.forEach(it => itemsMap.set(it.criteriaId, it));

    const firstFailed = detail.criteria.find(c => {
      const r = itemsMap.get(c._id || '');
      return r && !r.passed;
    });

    if (firstFailed?._id) {
      setExpandedCriteriaId(firstFailed._id);
    } else if (detail.criteria[0]?._id) {
      setExpandedCriteriaId(detail.criteria[0]._id);
    }
  }, [isGraded, detail?.criteria, currentResult, expandedCriteriaId]);

  const handleDownloadStarter = async () => {
    if (!detail?.task) return;
    const acceptExt = detail.task.subject === 'Excel' ? '.xlsx' : '.docx';
    try {
      const res = await api.get(`/practice/tasks/${taskId}/starter-file`, {
        responseType: 'blob',
      });
      const blobUrl = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${detail.task.title}${acceptExt}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      messageApi.error('Tải file đề gốc thất bại, vui lòng thử lại');
    }
  };

  const uploadProps: UploadProps = {
    accept: detail?.task?.subject === 'Excel' ? '.xlsx' : '.docx',
    maxCount: 1,
    showUploadList: false,
    action: `${api.defaults.baseURL}/practice/tasks/${taskId}/submit`,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    data: mockExamAttemptId ? { mockExamAttemptId } : undefined,
    beforeUpload: () => {
      setIsSubmitting(true);
      setLatestResult(null);
      return true;
    },
    onChange: info => {
      if (info.file.status === 'done') {
        setIsSubmitting(false);
        const result: PracticeSubmitResponse = info.file.response?.data;
        if (result) {
          setLatestResult(result);
          if (isMockExam) {
            messageApi.success('Đã nộp bài làm cho bài này.');
          } else if (result.isPass) {
            messageApi.success(
              `Đã đạt ${toScore10(result.totalScore, result.maxScore)}/10 điểm — bạn có thể qua nội dung tiếp theo.`,
            );
            onPassed?.();
          } else {
            messageApi.warning(
              `Được ${toScore10(result.totalScore, result.maxScore)}/10 điểm — cần đạt tối thiểu 8 điểm mới được qua nội dung tiếp theo, hãy làm lại.`,
            );
          }
          refetchSubmissions();
          onSubmitted?.();
        }
      }
      if (info.file.status === 'error') {
        setIsSubmitting(false);
        const serverMessage = (info.file.response as any)?.message;
        messageApi.error(serverMessage || 'Nộp bài thất bại, vui lòng thử lại');
      }
    },
  };

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <Spin size="large" />
      </View>
    );
  }

  if (!detail?.task) {
    const rawMessage =
      (detailError as any)?.data?.message ?? (detailError as any)?.message;
    const lockedMessage = typeof rawMessage === 'string' ? rawMessage : '';
    return (
      <View style={styles.pageContainer}>
        <Empty description={lockedMessage || 'Không tìm thấy đề thực hành'} />
      </View>
    );
  }

  const { task, criteria = [] } = detail;
  const accept = task.subject === 'Excel' ? '.xlsx' : '.docx';
  const isExcel = task.subject === 'Excel';
  const subjectBg = isExcel ? '#217346' : '#2b579a';
  const subjectLetter = isExcel ? 'X' : 'W';

  // Kết quả từng tiêu chí
  const resultMap = new Map<string, PracticeSubmissionResultItem>();
  currentResult?.items?.forEach(item => {
    resultMap.set(item.criteriaId, item);
  });

  const passedCriteriaCount = criteria.filter(c => {
    const r = resultMap.get(c._id || '');
    return r?.passed;
  }).length;

  const failedCriteriaList = criteria
    .map((c, idx) => {
      const res = resultMap.get(c._id || '');
      const inst = instructions?.find(i => i.criteriaId === c._id);
      return {
        criterion: c,
        index: idx,
        result: res,
        instruction: inst,
      };
    })
    .filter(item => item.result && !item.result.passed);

  const hasFixes = isGraded && failedCriteriaList.length > 0;
  const fixCount = failedCriteriaList.length;

  // Tính điểm tổng 10
  const score10 = currentResult
    ? toScore10(currentResult.totalScore, currentResult.maxScore)
    : 0;

  // Tính toán dữ liệu xem trước vùng ô (Live từ file thật nếu có, hoặc mô phỏng chuẩn)
  const getCriterionGridData = (
    c: PracticeCriteria,
  ):
    | (CellWindowResult & {
        isSheetNotFound?: boolean;
        missingSheetName?: string;
        availableSheets?: string[];
      })
    | null => {
    const cellTarget = c.params?.cell as string | undefined;
    const ySplit = c.params?.ySplit as number | undefined;
    const reqSheet = (c.params?.sheet as string | undefined) || 'Sheet1';

    // 1. Nếu đã đọc được workbook thật từ file nộp:
    if (workbook) {
      const windowRes = buildCellWindow(
        workbook,
        reqSheet,
        cellTarget,
        ySplit,
        selectedCells[c._id || ''],
      );
      if (!windowRes) {
        return {
          visibleCols: [],
          visibleRows: [],
          cellMap: {},
          activeCellAddr: '',
          activeCellFormula: '',
          rangeWin: '',
          isSheetNotFound: true,
          missingSheetName: reqSheet,
          availableSheets: workbook.SheetNames,
        };
      }
      return windowRes;
    }

    // 2. Chế độ dự phòng chuẩn khi chưa tải xong file
    let targetCol = 'F';
    let targetRow = 5;

    if (cellTarget) {
      const colMatch = cellTarget.match(/[A-Z]+/i);
      const rowMatch = cellTarget.match(/\d+/);
      if (colMatch) targetCol = colMatch[0].toUpperCase();
      if (rowMatch) targetRow = parseInt(rowMatch[0], 10);
    }

    const colIdx = Math.max(0, COLS.indexOf(targetCol));
    const startColIdx = Math.max(0, Math.min(colIdx - 2, COLS.length - 4));
    const visibleCols = COLS.slice(startColIdx, startColIdx + 4);

    const startRow = Math.max(1, targetRow - 2);
    const visibleRows = [startRow, startRow + 1, startRow + 2, startRow + 3];

    const formulaText = c.params?.mustContain
      ? `=${c.params.mustContain}(...)`
      : '=SUM(...)';

    const cellMap: Record<string, any> = {};
    visibleRows.forEach(r => {
      visibleCols.forEach(col => {
        const addr = `${col}${r}`;
        const isTarget = cellTarget ? addr === cellTarget : false;
        cellMap[addr] = {
          address: addr,
          value: isTarget ? '420,000' : '150,000',
          formula: isTarget ? formulaText : undefined,
          align: 'right',
        };
      });
    });

    const activeCellAddr =
      selectedCells[c._id || ''] ||
      cellTarget ||
      `${visibleCols[0]}${visibleRows[0]}`;
    const activeCellData = cellMap[activeCellAddr] || {
      address: activeCellAddr,
      value: '',
      formula: '',
    };

    return {
      visibleCols,
      visibleRows,
      cellMap,
      targetCell: cellTarget,
      ySplit,
      activeCellAddr,
      activeCellFormula: activeCellData.formula || activeCellData.value || '',
      rangeWin: `${visibleCols[0]}${visibleRows[0]}:${visibleCols[visibleCols.length - 1]}${visibleRows[visibleRows.length - 1]}`,
    };
  };

  return (
    <View style={styles.pageContainer}>
      {/* 1. Sticky Header chuẩn phòng thi / thực hành theo ExamRoom v2 */}
      {!isMockExam && (
        <View style={isMobile ? styles.headerMobile : styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={styles.backButton}
              onClick={() => router.push('/dashboard/practice')}
              {...asButton(
                () => router.push('/dashboard/practice'),
                'Quay lại',
              )}>
              <Text style={styles.backButtonText}>← Quay lại</Text>
            </View>

            <View
              aria-hidden="true"
              style={{
                ...styles.subjectIconBadge,
                backgroundColor: subjectBg,
              }}>
              <Text style={styles.subjectIconBadgeText}>{subjectLetter}</Text>
            </View>

            <View style={styles.headerTitleCol}>
              <Text
                style={
                  isMobile ? styles.headerTitleMobile : styles.headerTitle
                }>
                {task.title}
              </Text>
              <Text style={styles.headerMeta}>
                {task.subject} · {task.difficulty || 'Trung bình'} ·{' '}
                {criteria.length} yêu cầu chấm điểm
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <BookmarkButton
              itemType="practiceTask"
              itemId={taskId}
              bookmarked={(bookmarkedTaskIds || []).includes(taskId)}
              size={22}
            />

            {/* Chip trạng thái nộp bài */}
            <View
              style={{
                ...styles.statusChip,
                backgroundColor: isSubmitting
                  ? 'var(--color-info-bg)'
                  : isGraded
                    ? currentResult?.isPass
                      ? 'var(--color-success-bg)'
                      : 'var(--color-error-bg)'
                    : 'var(--color-surface-subtle)',
              }}>
              <Text
                style={{
                  ...styles.statusChipText,
                  color: isSubmitting
                    ? 'var(--color-info)'
                    : isGraded
                      ? currentResult?.isPass
                        ? 'var(--color-success)'
                        : 'var(--color-error)'
                      : 'var(--color-text-muted)',
                }}>
                {isSubmitting
                  ? '◌ Đang chấm…'
                  : isGraded
                    ? currentResult?.isPass
                      ? `✓ Đạt · ${score10}/10`
                      : `✕ Chưa đạt · ${score10}/10`
                    : '○ Chưa nộp'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 2. Thân trang: bố cục 2 cột (Main bên trái, Aside bên phải) */}
      <View style={isMobile ? styles.bodyRowMobile : styles.bodyRow}>
        {/* CỘT CHÍNH */}
        <View style={styles.mainCol}>
          {/* Thanh Tabs (chỉ hiện khi đã nộp và có yêu cầu chưa đạt) */}
          {hasFixes && (
            <View style={styles.tabList}>
              <View
                style={[
                  styles.tabItem,
                  activeTab === 'task' && styles.tabItemActive,
                ]}
                onClick={() => setActiveTab('task')}
                {...asButton(
                  () => setActiveTab('task'),
                  'Xem tab Đề bài & Nhiệm vụ',
                )}>
                <Text
                  style={[
                    styles.tabItemText,
                    activeTab === 'task' && styles.tabItemTextActive,
                  ]}>
                  Đề bài &amp; Nhiệm vụ
                </Text>
              </View>
              <View
                style={[
                  styles.tabItem,
                  activeTab === 'fix' && styles.tabItemActive,
                ]}
                onClick={() => setActiveTab('fix')}
                {...asButton(
                  () => setActiveTab('fix'),
                  'Xem tab Hướng dẫn sửa lỗi',
                )}>
                <Text
                  style={[
                    styles.tabItemText,
                    activeTab === 'fix' && styles.tabItemTextActive,
                  ]}>
                  Hướng dẫn sửa lỗi
                </Text>
                <View style={styles.fixBadge}>
                  <Text style={styles.fixBadgeText}>{fixCount}</Text>
                </View>
              </View>
            </View>
          )}

          {/* TAB 1: Đề bài & Nhiệm vụ */}
          {activeTab === 'task' && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderTitleRow}>
                  <Text style={styles.cardHeaderTitle}>Yêu cầu đề bài</Text>
                  <Text style={styles.cardHeaderCounter}>
                    {isGraded
                      ? `${passedCriteriaCount}/${criteria.length} yêu cầu đạt`
                      : `${criteria.length} yêu cầu`}
                  </Text>
                </View>
                <Text style={styles.cardHeaderDesc}>
                  {task.description ||
                    `Mở file đề gốc, hoàn thành các yêu cầu bên dưới trên sheet ${criteria[0]?.params?.sheet || 'bài làm'}, lưu lại rồi nộp file ${accept}.`}
                </Text>
              </View>

              {/* Danh sách từng tiêu chí */}
              <View style={{ flexDirection: 'column' }}>
                {criteria.map((c, idx) => {
                  const inst = instructions?.find(i => i.criteriaId === c._id);
                  const res = resultMap.get(c._id || '');
                  const isPassed = res?.passed;
                  const isFailed = res && !res.passed;
                  const isOpen = expandedCriteriaId === c._id;
                  const isChart = c.type.includes('chart');

                  const whereStr = [
                    c.params?.sheet ? `Sheet ${c.params.sheet}` : null,
                    c.params?.cell ? `ô ${c.params.cell}` : null,
                    c.params?.range ? `vùng ${c.params.range}` : null,
                    c.params?.ySplit ? `cố định ${c.params.ySplit} hàng` : null,
                    isChart ? 'biểu đồ' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ');

                  const gridData = isExcel ? getCriterionGridData(c) : null;

                  return (
                    <View
                      key={c._id || idx}
                      style={{
                        ...styles.criterionRow,
                        ...(isOpen ? styles.criterionRowExpanded : {}),
                      }}>
                      <View style={styles.criterionHeader}>
                        {/* Huy hiệu số hoặc kết quả */}
                        <View
                          style={{
                            ...styles.criterionNum,
                            backgroundColor: isGraded
                              ? isPassed
                                ? 'var(--color-success-bg)'
                                : 'var(--color-error-bg)'
                              : 'var(--color-info-bg)',
                          }}>
                          <Text
                            style={{
                              ...styles.criterionNumText,
                              color: isGraded
                                ? isPassed
                                  ? 'var(--color-success)'
                                  : 'var(--color-error)'
                                : 'var(--color-vhu-primary)',
                            }}>
                            {isGraded ? (isPassed ? '✓' : '✕') : idx + 1}
                          </Text>
                        </View>

                        {/* Thân tiêu chí */}
                        <View style={styles.criterionBody}>
                          <Text style={styles.criterionSummary}>
                            Yêu cầu {idx + 1}:{' '}
                            {inst?.summary ||
                              `Thực hiện kiểm tra ${PRACTICE_CRITERIA_LABELS[c.type] || c.type}`}
                          </Text>

                          <View style={styles.criterionMetaRow}>
                            <View style={styles.typeBadge}>
                              <Text style={styles.typeBadgeText}>
                                {PRACTICE_CRITERIA_LABELS[c.type] || c.type}
                              </Text>
                            </View>
                            {whereStr ? (
                              <Text style={styles.whereText}>{whereStr}</Text>
                            ) : null}
                          </View>

                          {/* Hành động xem trước và chuyển tab sửa lỗi */}
                          {isGraded && (
                            <View style={styles.actionsRow}>
                              <View
                                style={styles.toggleBtn}
                                onClick={() =>
                                  setExpandedCriteriaId(
                                    isOpen ? null : c._id || null,
                                  )
                                }
                                {...asButton(
                                  () =>
                                    setExpandedCriteriaId(
                                      isOpen ? null : c._id || null,
                                    ),
                                  isOpen
                                    ? 'Ẩn vùng ô'
                                    : 'Xem vùng ô trong bài làm',
                                )}>
                                <Text style={styles.toggleBtnText}>
                                  {isOpen ? '▾ ' : '▸ '}
                                  {isChart
                                    ? isOpen
                                      ? 'Ẩn thông tin biểu đồ'
                                      : 'Xem thông tin biểu đồ'
                                    : isOpen
                                      ? 'Ẩn vùng ô'
                                      : 'Xem vùng ô trong bài làm'}
                                </Text>
                              </View>

                              {isFailed && (
                                <View
                                  style={styles.goFixBtn}
                                  onClick={() => setActiveTab('fix')}
                                  {...asButton(
                                    () => setActiveTab('fix'),
                                    'Xem hướng dẫn sửa lỗi cho yêu cầu này',
                                  )}>
                                  <Text style={styles.goFixBtnText}>
                                    Xem hướng dẫn sửa →
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                        </View>

                        {/* Huy hiệu trạng thái Đạt/Chưa đạt */}
                        {isGraded && (
                          <View
                            style={{
                              ...styles.criterionStatusBadge,
                              backgroundColor: isPassed
                                ? 'var(--color-success-bg)'
                                : 'var(--color-error-bg)',
                            }}>
                            <Text
                              style={{
                                ...styles.criterionStatusBadgeText,
                                color: isPassed
                                  ? 'var(--color-success)'
                                  : 'var(--color-error)',
                              }}>
                              {isPassed ? '✓ Đạt' : '✕ Chưa đạt'}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Khung xem trước vùng ô (4 trạng thái: vReading, vError, vChart, vGrid) */}
                      {isOpen && (
                        <View
                          style={
                            isMobile
                              ? styles.previewWrapMobile
                              : styles.previewWrap
                          }>
                          <View style={styles.previewBox}>
                            {isReadingFile ? (
                              /* 1. vReading: Đang đọc file */
                              <View style={styles.readingContainer}>
                                <View style={styles.readingHeaderRow}>
                                  <Spin size="small" />
                                  <Text style={styles.readingHeaderText}>
                                    Đang đọc file bài làm trên máy bạn…
                                  </Text>
                                </View>
                                <View style={styles.readingSkeletonGrid}>
                                  {[1, 2, 3, 4].map(sRow => (
                                    <View
                                      key={sRow}
                                      style={styles.readingSkeletonRow}>
                                      {[1, 2, 3, 4].map(sCol => (
                                        <View
                                          key={sCol}
                                          style={styles.readingSkeletonCell}
                                        />
                                      ))}
                                    </View>
                                  ))}
                                </View>
                                <Text style={styles.readingFooterNote}>
                                  Điểm số ở trên đã có sẵn, không cần đợi bước
                                  này.
                                </Text>
                              </View>
                            ) : isChart ? (
                              /* 2. vChart: Tiêu chí biểu đồ */
                              <View style={styles.chartContainer}>
                                <View
                                  aria-hidden="true"
                                  style={styles.chartIconBadge}>
                                  <View style={styles.chartBar1} />
                                  <View style={styles.chartBar2} />
                                  <View style={styles.chartBar3} />
                                </View>
                                <View style={styles.chartCol}>
                                  <Text style={styles.chartTitleText}>
                                    Có biểu đồ: Chart Title trên sheet{' '}
                                    {c.params?.sheet || 'bài làm'}
                                  </Text>
                                  <Text style={styles.chartNoteText}>
                                    Đọc từ file bạn nộp. Khung xem không vẽ lại
                                    biểu đồ, chỉ hiện loại và tiêu đề.
                                  </Text>
                                </View>
                              </View>
                            ) : gridData?.isSheetNotFound ? (
                              /* 3. vError: Tên sheet không khớp trong file thật */
                              <View style={styles.errorContainer}>
                                <View
                                  aria-hidden="true"
                                  style={styles.errorIconBadge}>
                                  <Text style={styles.errorIconBadgeText}>
                                    !
                                  </Text>
                                </View>
                                <View style={styles.errorCol}>
                                  <Text style={styles.errorTitle}>
                                    Không tìm thấy sheet “
                                    {gridData.missingSheetName}” trong file đã
                                    nộp
                                  </Text>
                                  <Text style={styles.errorBody}>
                                    Sheet có trong file:{' '}
                                    {gridData.availableSheets?.join(', ') ||
                                      'Không xác định'}
                                    . Điểm và trạng thái ở trên vẫn đúng theo
                                    kết quả chấm — chỉ khung xem trước không
                                    hiển thị được.
                                  </Text>
                                </View>
                              </View>
                            ) : fileReadError ? (
                              /* 3. vError: Lỗi đọc file chung */
                              <View style={styles.errorContainer}>
                                <View
                                  aria-hidden="true"
                                  style={styles.errorIconBadge}>
                                  <Text style={styles.errorIconBadgeText}>
                                    !
                                  </Text>
                                </View>
                                <View style={styles.errorCol}>
                                  <Text style={styles.errorTitle}>
                                    Không mở được file bài làm
                                  </Text>
                                  <Text style={styles.errorBody}>
                                    {fileReadError}
                                  </Text>
                                </View>
                              </View>
                            ) : gridData && gridData.visibleCols.length > 0 ? (
                              /* 4. vGrid: Lưới ô tính và thanh công thức fx */
                              <View style={{ flexDirection: 'column' }}>
                                <View style={styles.gridTopBar}>
                                  <Text style={styles.gridTopBarSheetText}>
                                    Sheet {c.params?.sheet || 'Sheet1'} · vùng{' '}
                                    {gridData.rangeWin}
                                  </Text>
                                  <Text
                                    style={{
                                      ...styles.gridTopBarTargetText,
                                      color: isPassed
                                        ? 'var(--color-success)'
                                        : 'var(--color-error)',
                                    }}>
                                    {isPassed ? '✓ ' : '✕ '}Ô được chấm:{' '}
                                    {gridData.targetCell || 'Khóa'} ·{' '}
                                    {isPassed ? 'Đạt' : 'Chưa đạt'}
                                  </Text>
                                </View>

                                {/* Thanh công thức */}
                                <View style={styles.formulaBar}>
                                  <View style={styles.formulaAddrBox}>
                                    <Text
                                      style={{
                                        ...typography.caption,
                                        fontWeight: '500',
                                      }}>
                                      {gridData.activeCellAddr}
                                    </Text>
                                  </View>
                                  <View
                                    aria-hidden="true"
                                    style={styles.formulaFxBox}>
                                    <Text
                                      style={{
                                        ...typography.caption,
                                        fontStyle: 'italic',
                                        color: 'var(--color-text-muted)',
                                      }}>
                                      fx
                                    </Text>
                                  </View>
                                  <View style={styles.formulaValBox}>
                                    <Text
                                      style={{
                                        fontFamily:
                                          'ui-monospace, Consolas, monospace',
                                        ...typography.caption,
                                      }}>
                                      {gridData.activeCellFormula}
                                    </Text>
                                  </View>
                                </View>

                                {/* Lưới ô Flexbox chuẩn React Native Web */}
                                <View style={styles.tableScrollWrap}>
                                  <View style={styles.gridTable}>
                                    {/* Hàng tiêu đề cột */}
                                    <View style={styles.gridRow}>
                                      <View style={styles.gridThCorner} />
                                      {gridData.visibleCols.map(col => {
                                        const isActiveCol =
                                          gridData.activeCellAddr.startsWith(
                                            col,
                                          );
                                        return (
                                          <View
                                            key={col}
                                            style={[
                                              styles.gridThCol,
                                              isActiveCol &&
                                                styles.gridThColActive,
                                            ]}>
                                            <Text style={styles.gridThColText}>
                                              {col}
                                            </Text>
                                          </View>
                                        );
                                      })}
                                    </View>

                                    {/* Các hàng dữ liệu */}
                                    {gridData.visibleRows.map(r => {
                                      const isActiveRow =
                                        gridData.activeCellAddr.includes(
                                          String(r),
                                        );
                                      const isFreeze = gridData.ySplit === r;
                                      return (
                                        <View key={r} style={styles.gridRow}>
                                          <View
                                            style={[
                                              styles.gridThRow,
                                              isActiveRow &&
                                                styles.gridThRowActive,
                                              isFreeze &&
                                                styles.gridThRowFreeze,
                                            ]}>
                                            <Text style={styles.gridThRowText}>
                                              {r}
                                            </Text>
                                          </View>
                                          {gridData.visibleCols.map(col => {
                                            const addr = `${col}${r}`;
                                            const cell = gridData.cellMap[addr];
                                            const isCellSel =
                                              addr === gridData.activeCellAddr;
                                            const isTarget =
                                              addr === gridData.targetCell;

                                            return (
                                              <View
                                                key={addr}
                                                {...asButton(
                                                  () =>
                                                    setSelectedCells(prev => ({
                                                      ...prev,
                                                      [c._id || '']: addr,
                                                    })),
                                                  `Ô ${addr}`,
                                                )}
                                                style={[
                                                  styles.gridTdCell,
                                                  isTarget &&
                                                    (isPassed
                                                      ? styles.gridTdCellTargetPass
                                                      : styles.gridTdCellTargetFail),
                                                  isCellSel &&
                                                    styles.gridTdCellSelected,
                                                ]}>
                                                <Text
                                                  style={[
                                                    styles.gridTdCellText,
                                                    {
                                                      textAlign:
                                                        cell?.align || 'left',
                                                    },
                                                  ]}>
                                                  {cell?.value || ''}
                                                </Text>
                                              </View>
                                            );
                                          })}
                                        </View>
                                      );
                                    })}
                                  </View>
                                </View>

                                <View style={styles.gridFooterNote}>
                                  <Text
                                    style={{
                                      ...typography.caption,
                                      color: 'var(--color-text-muted)',
                                      lineHeight: 18,
                                    }}>
                                    {gridData.ySplit
                                      ? `Đường đậm dưới hàng ${gridData.ySplit} = vùng cố định đọc từ file (ySplit = ${gridData.ySplit}). Màu/viền ô là mô phỏng.`
                                      : 'Giá trị, công thức và định dạng số đọc từ file bạn nộp. Màu nền, viền, font ô là mô phỏng theo giao diện LearnNest.'}
                                  </Text>
                                </View>
                              </View>
                            ) : (
                              /* Fallback thông báo */
                              <View style={styles.errorContainer}>
                                <View
                                  aria-hidden="true"
                                  style={styles.errorIconBadge}>
                                  <Text style={styles.errorIconBadgeText}>
                                    !
                                  </Text>
                                </View>
                                <View style={styles.errorCol}>
                                  <Text style={styles.errorTitle}>
                                    Không thể hiển thị vùng ô
                                  </Text>
                                  <Text style={styles.errorBody}>
                                    File bài làm không chứa định dạng bảng tính
                                    phù hợp để vẽ lại khung xem trước.
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* TAB 2: Hướng dẫn sửa lỗi */}
          {activeTab === 'fix' && (
            <View style={styles.fixContainer}>
              <Text style={styles.fixIntroText}>
                {failedCriteriaList.length} yêu cầu chưa đạt ở lần nộp gần nhất.
                Làm theo từng bước bên dưới rồi nộp lại file bài làm.
              </Text>

              {failedCriteriaList.map(item => {
                const c = item.criterion;
                const inst = item.instruction;
                const rawInstruction =
                  item.result?.instruction || inst?.instruction || '';
                const steps = rawInstruction
                  ? rawInstruction
                      .split(/(?=Bước\s+\d+:?)/gi)
                      .map(s => s.trim())
                      .filter(Boolean)
                  : [
                      'Xem lại yêu cầu và thực hiện lại các thao tác theo đúng chuẩn MOS.',
                    ];
                const isChart = c.type.includes('chart');

                return (
                  <View key={c._id || item.index} style={styles.fixCard}>
                    <View style={styles.fixCardHeader}>
                      <Text style={styles.fixCardTitle}>
                        Yêu cầu {item.index + 1} ·{' '}
                        {PRACTICE_CRITERIA_LABELS[c.type] || c.type}
                      </Text>
                      <View
                        style={{
                          ...styles.criterionStatusBadge,
                          backgroundColor: 'var(--color-error-bg)',
                        }}>
                        <Text
                          style={{
                            ...styles.criterionStatusBadgeText,
                            color: 'var(--color-error)',
                          }}>
                          ✕ Chưa đạt
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.fixSummaryText}>
                      {inst?.summary ||
                        `Yêu cầu kiểm tra ${PRACTICE_CRITERIA_LABELS[c.type]}`}
                    </Text>

                    <View style={styles.fixStepList}>
                      {steps.map((st, sIdx) => (
                        <Text key={sIdx} style={styles.fixStepText}>
                          {st.startsWith('Bước')
                            ? st
                            : `Bước ${sIdx + 1}: ${st}`}
                        </Text>
                      ))}
                    </View>

                    <View>
                      <View
                        style={styles.toggleBtn}
                        onClick={() => {
                          setActiveTab('task');
                          setExpandedCriteriaId(c._id || null);
                        }}
                        {...asButton(() => {
                          setActiveTab('task');
                          setExpandedCriteriaId(c._id || null);
                        }, 'Xem vùng ô trong bài làm cho yêu cầu này')}>
                        <Text style={styles.toggleBtnText}>
                          {isChart
                            ? 'Xem thông tin biểu đồ trong bài làm →'
                            : 'Xem vùng ô trong bài làm →'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              <View style={styles.fixFooterNote}>
                <Text
                  style={{
                    ...typography.caption,
                    color: 'var(--color-text-muted)',
                  }}>
                  Hướng dẫn soạn sẵn theo từng loại tiêu chí. Yêu cầu đã đạt
                  không hiện ở đây.
                </Text>
              </View>
            </View>
          )}

          {/* Thảo luận khi làm bài thường */}
          {!isMockExam && (
            <View style={styles.discussionBox}>
              <Text style={styles.discussionTitle}>Thảo luận</Text>
              <CommentSection postId={taskId} type="PracticeTask" inline />
            </View>
          )}
        </View>

        {/* CỘT PHẢI (Aside): Nộp bài, Kết quả & Lịch sử */}
        <View style={isMobile ? styles.asideColMobile : styles.asideCol}>
          <View style={styles.asideSection}>
            {/* Điểm số lần nộp gần nhất */}
            {isGraded && currentResult && (
              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>Kết quả lần nộp gần nhất</Text>
                <View style={styles.scoreRow}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'baseline',
                      gap: 2,
                    }}>
                    <Text style={styles.scoreBigText}>{score10}</Text>
                    <Text style={styles.scoreTotalText}>/10</Text>
                  </View>
                  <View
                    style={{
                      ...styles.statusChip,
                      backgroundColor: currentResult.isPass
                        ? 'var(--color-success-bg)'
                        : 'var(--color-error-bg)',
                    }}>
                    <Text
                      style={{
                        ...styles.statusChipText,
                        color: currentResult.isPass
                          ? 'var(--color-success)'
                          : 'var(--color-error)',
                      }}>
                      {currentResult.isPass ? '✓ Đạt' : '✕ Chưa đạt (cần ≥ 8)'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.scoreNoteText}>
                  {currentResult.isPass
                    ? `${passedCriteriaCount}/${criteria.length} yêu cầu đạt. Đã mở khóa nội dung tiếp theo trong khóa học.`
                    : `${passedCriteriaCount}/${criteria.length} yêu cầu đạt. Cần tối thiểu 8 điểm để qua bài — xem tab Hướng dẫn sửa lỗi rồi nộp lại.`}
                </Text>
              </View>
            )}

            {/* Thông tin nộp bài */}
            <View style={styles.uploadHeaderRow}>
              <View
                aria-hidden="true"
                style={{
                  ...styles.subjectIconBadge,
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: subjectBg,
                }}>
                <Text style={{ ...styles.subjectIconBadgeText, fontSize: 16 }}>
                  {subjectLetter}
                </Text>
              </View>
              <View style={styles.uploadTitleCol}>
                <Text style={styles.uploadTitleText}>
                  Nộp bài làm {task.subject}
                </Text>
                <Text style={styles.uploadHintText}>
                  File {accept}, tối đa 20MB
                </Text>
              </View>
            </View>

            {/* Nút Tải đề / Nộp bài trên Desktop */}
            {!isMobile && (
              <View style={styles.uploadBtnCol}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadStarter}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 8,
                    fontWeight: 500,
                  }}>
                  Tải file đề gốc
                </Button>
                <Upload {...uploadProps}>
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    loading={isSubmitting}
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 8,
                      fontWeight: 500,
                      backgroundColor: 'var(--color-vhu-primary)',
                    }}>
                    {isSubmitting
                      ? 'Đang chấm bài…'
                      : isGraded
                        ? `Nộp lại (${accept})`
                        : `Nộp bài làm (${accept})`}
                  </Button>
                </Upload>
              </View>
            )}

            {/* Ghi chú trạng thái */}
            <View
              style={{
                ...styles.statusNoteBox,
                backgroundColor: isSubmitting
                  ? 'var(--color-info-bg)'
                  : 'var(--color-surface-subtle)',
              }}>
              <Text
                style={{
                  ...styles.statusNoteText,
                  color: isSubmitting
                    ? 'var(--color-info)'
                    : 'var(--color-text-body)',
                }}>
                {isSubmitting
                  ? '◌ Đã tải lên. Hệ thống đang chấm điểm, thường mất vài giây.'
                  : isMockExam
                    ? '○ Chưa nộp bài này. Kết quả của từng bài chỉ hiện sau khi nộp bài thi.'
                    : isGraded
                      ? 'ℹ Nộp lại bất kỳ lúc nào — mỗi lần nộp được chấm và lưu vào lịch sử.'
                      : `ℹ ${criteria.length} yêu cầu chấm điểm · cần đạt tối thiểu 8/10 để qua bài.`}
              </Text>
            </View>
          </View>

          {/* Lịch sử nộp bài */}
          {!isMockExam && submissions && submissions.length > 0 && (
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                Lịch sử nộp bài ({submissions.length} lần)
              </View>
              {submissions.map((s, idx) => {
                const sScore = toScore10(s.totalScore, s.maxScore);
                const sPass = sScore >= 8;
                return (
                  <View key={s._id} style={styles.historyRow}>
                    <Text style={styles.historyAttemptLabel}>
                      Lần {submissions.length - idx}
                    </Text>
                    <Text style={styles.historyScoreText}>{sScore}/10</Text>
                    <View
                      style={{
                        ...styles.criterionStatusBadge,
                        backgroundColor: sPass
                          ? 'var(--color-success-bg)'
                          : 'var(--color-error-bg)',
                      }}>
                      <Text
                        style={{
                          ...styles.criterionStatusBadgeText,
                          color: sPass
                            ? 'var(--color-success)'
                            : 'var(--color-error)',
                        }}>
                        {sPass ? '✓ Đạt' : '✕ Chưa đạt'}
                      </Text>
                    </View>
                    <Text style={styles.historyTimeText}>
                      {dayjs(s.submittedAt).format('HH:mm DD/MM')}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* Thanh nút bấm cố định dưới đáy trên Mobile */}
      {isMobile && (
        <View style={styles.bottomBarSticky}>
          <View style={{ flex: 1 }}>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadStarter}
              style={{
                width: '100%',
                height: 44,
                borderRadius: 8,
                fontWeight: 500,
              }}>
              Tải đề gốc
            </Button>
          </View>
          <View style={{ flex: 1.4 }}>
            <Upload {...uploadProps}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={isSubmitting}
                style={{
                  width: '100%',
                  height: 44,
                  borderRadius: 8,
                  fontWeight: 500,
                  backgroundColor: 'var(--color-vhu-primary)',
                }}>
                {isSubmitting ? 'Đang chấm…' : `Nộp bài (${accept})`}
              </Button>
            </Upload>
          </View>
        </View>
      )}
    </View>
  );
};

export const ResultItemRow: React.FC<{
  item: PracticeSubmissionResultItem;
  index: number;
}> = ({ item, index }) => (
  <View style={styles.resultItemRow}>
    {item.passed ? (
      <CheckCircleFilled
        style={{ color: 'var(--color-success)', marginTop: 2 }}
      />
    ) : (
      <CloseCircleFilled
        style={{ color: 'var(--color-error)', marginTop: 2 }}
      />
    )}
    <View style={{ flex: 1, minWidth: 0, flexDirection: 'column' }}>
      <Text style={styles.resultItemTitle}>Yêu cầu {index + 1}</Text>
      {!item.passed && item.instruction && (
        <Text style={styles.resultItemInstruction}>{item.instruction}</Text>
      )}
    </View>
  </View>
);

export default PracticeTaskContent;
