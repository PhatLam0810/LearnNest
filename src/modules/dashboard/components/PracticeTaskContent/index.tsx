'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
import styles from './styles';

type Props = {
  taskId: string;
  onPassed?: () => void;
  mockExamAttemptId?: string;
  onSubmitted?: () => void;
};

const toScore10 = (total: number, max: number) =>
  max ? Number(((total / max) * 10).toFixed(1)) : 0;

const PracticeTaskContent: React.FC<Props> = ({
  taskId,
  onPassed,
  mockExamAttemptId,
  onSubmitted,
}) => {
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
  const [workbook, setWorkbook] = useState<WorkBook | null>(null);
  const [workbookLoading, setWorkbookLoading] = useState(false);
  const [workbookError, setWorkbookError] = useState<string | null>(null);

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
  }

  // Lấy kết quả chấm từ lần nộp mới nhất trong session hoặc lịch sử nộp bài gần nhất
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

  const isGraded = Boolean(currentResult);
  const isMockExam = !!mockExamAttemptId;

  // Đọc THẬT file vừa nộp để khung xem vùng ô hiện đúng giá trị/công thức -
  // đọc 1 lần cho cả bài (không phải mỗi tiêu chí đọc lại), tải qua endpoint
  // riêng vì fileUrl (GCS) không cho fetch thẳng từ trình duyệt (không CORS).
  useEffect(() => {
    const submissionId = currentResult?.submissionId;
    if (!submissionId || detail?.task?.subject !== 'Excel') {
      setWorkbook(null);
      setWorkbookError(null);
      return;
    }
    let cancelled = false;
    setWorkbookLoading(true);
    setWorkbookError(null);
    api
      .get(`/practice/submissions/${submissionId}/file`, {
        responseType: 'blob',
      })
      .then(res => readWorkbook(res.data))
      .then(wb => {
        if (!cancelled) setWorkbook(wb);
      })
      .catch(() => {
        if (!cancelled) {
          setWorkbook(null);
          setWorkbookError('Không đọc được file bài nộp để xem trước vùng ô.');
        }
      })
      .finally(() => {
        if (!cancelled) setWorkbookLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentResult?.submissionId, detail?.task?.subject]);

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
      <div style={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!detail?.task) {
    const rawMessage =
      (detailError as any)?.data?.message ?? (detailError as any)?.message;
    const lockedMessage = typeof rawMessage === 'string' ? rawMessage : '';
    return (
      <div style={styles.container}>
        <Empty description={lockedMessage || 'Không tìm thấy đề thực hành'} />
      </div>
    );
  }

  const { task, criteria = [] } = detail;
  const accept = task.subject === 'Excel' ? '.xlsx' : '.docx';
  const isExcel = task.subject === 'Excel';
  const subjectColor = isExcel
    ? 'var(--color-subject-excel)'
    : 'var(--color-subject-word)';
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

  // Vùng ô + thanh công thức quanh 1 tiêu chí Excel — đọc THẬT từ workbook
  // (bài đã nộp), không còn bịa số. 3 kết quả có thể có:
  // - workbookLoading -> 'reading' (đang tải/đọc file, hiện skeleton)
  // - đọc xong nhưng thiếu sheet/không có workbook -> null (hiện lỗi)
  // - đọc xong và có sheet -> CellWindowResult (hiện lưới ô thật)
  type GridResult = CellWindowResult | 'reading' | null;
  const getCriterionGridData = (c: PracticeCriteria): GridResult => {
    if (workbookLoading) return 'reading';
    if (!workbook) return null;
    const sheetName = (c.params?.sheet as string | undefined) || '';
    const cellTarget = c.params?.cell as string | undefined;
    const ySplit = c.params?.ySplit as number | undefined;
    const selectedAddr = selectedCells[c._id || ''];
    return buildCellWindow(
      workbook,
      sheetName,
      cellTarget,
      ySplit,
      selectedAddr,
    );
  };

  return (
    <div style={styles.container}>
      {/* Header đề bài */}
      <div style={styles.header}>
        <h1 style={isMobile ? styles.titleMobile : styles.title}>
          {task.title}
        </h1>
        {!isMockExam && (
          <BookmarkButton
            itemType="practiceTask"
            itemId={taskId}
            bookmarked={(bookmarkedTaskIds || []).includes(taskId)}
            size={22}
          />
        )}
      </div>

      {/* Thanh tab khi có lỗi cần sửa */}
      {hasFixes && (
        <div role="tablist" aria-label="Nội dung bài" style={styles.tabList}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'task'}
            onClick={() => setActiveTab('task')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'task' ? styles.tabButtonActive : {}),
            }}>
            <span
              style={{
                ...styles.tabText,
                ...(activeTab === 'task' ? styles.tabTextActive : {}),
              }}>
              Đề bài &amp; Nhiệm vụ
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'fix'}
            onClick={() => setActiveTab('fix')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'fix' ? styles.tabButtonActive : {}),
            }}>
            <span
              style={{
                ...styles.tabText,
                ...(activeTab === 'fix' ? styles.tabTextActive : {}),
              }}>
              Hướng dẫn sửa lỗi
            </span>
            <span style={styles.badgeCount}>
              <span style={styles.badgeCountText}>{fixCount}</span>
            </span>
          </button>
        </div>
      )}

      {/* Layout 2 cột: Trái là nội dung đề / sửa lỗi, Phải là nộp bài & lịch sử */}
      <div
        style={{
          ...styles.mainLayout,
          ...(isMobile ? styles.mainLayoutMobile : {}),
        }}>
        {/* CỘT CHÍNH */}
        <div style={styles.mainColumn}>
          {activeTab === 'task' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderTop}>
                  <span style={styles.cardTitle}>Yêu cầu đề bài</span>
                  <span style={styles.cardCounter}>
                    {isGraded
                      ? `${passedCriteriaCount}/${criteria.length} yêu cầu đạt`
                      : `${criteria.length} yêu cầu`}
                  </span>
                </div>
                <p style={styles.cardDesc}>
                  {task.description ||
                    `Mở file đề gốc, hoàn thành các yêu cầu bên dưới, lưu lại rồi nộp file ${accept}.`}
                </p>
              </div>

              {/* Danh sách các yêu cầu chấm điểm */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                    <div key={c._id || idx} style={styles.criteriaItem}>
                      <div style={styles.criteriaItemRow}>
                        {/* Huy hiệu số hoặc kết quả */}
                        <div
                          style={{
                            ...styles.criteriaNum,
                            backgroundColor: isGraded
                              ? isPassed
                                ? 'var(--color-success-bg)'
                                : 'var(--color-error-bg)'
                              : 'var(--color-info-bg)',
                          }}>
                          <span
                            style={{
                              ...styles.criteriaNumText,
                              color: isGraded
                                ? isPassed
                                  ? 'var(--color-success)'
                                  : 'var(--color-error)'
                                : 'var(--color-vhu-primary)',
                            }}>
                            {isGraded ? (isPassed ? '✓' : '✕') : idx + 1}
                          </span>
                        </div>

                        {/* Nội dung tiêu chí */}
                        <div style={styles.criteriaBody}>
                          <span style={styles.criteriaText}>
                            <strong style={{ fontWeight: '600' }}>
                              Yêu cầu {idx + 1}:
                            </strong>{' '}
                            {inst?.summary ||
                              `Thực hiện kiểm tra ${PRACTICE_CRITERIA_LABELS[c.type] || c.type}`}
                          </span>

                          <div style={styles.criteriaMetaRow}>
                            <div style={styles.typeTag}>
                              <span style={styles.typeTagText}>
                                {PRACTICE_CRITERIA_LABELS[c.type] || c.type}
                              </span>
                            </div>
                            {whereStr && (
                              <span style={styles.whereText}>{whereStr}</span>
                            )}
                          </div>

                          {/* Hành động xem trước và xem hướng dẫn sửa */}
                          {isGraded && (
                            <div style={styles.criteriaActionsRow}>
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedCriteriaId(
                                    isOpen ? null : c._id || null,
                                  )
                                }
                                style={{
                                  ...styles.actionTextButton,
                                  ...styles.actionTextButtonBlue,
                                }}>
                                <span>{isOpen ? '▾' : '▸'}</span>
                                <span>
                                  {isChart
                                    ? isOpen
                                      ? 'Ẩn thông tin biểu đồ'
                                      : 'Xem thông tin biểu đồ'
                                    : isOpen
                                      ? 'Ẩn vùng ô'
                                      : 'Xem vùng ô trong bài làm'}
                                </span>
                              </button>

                              {isFailed && (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('fix')}
                                  style={{
                                    ...styles.actionTextButton,
                                    ...styles.actionTextButtonRed,
                                  }}>
                                  <span>Xem hướng dẫn sửa →</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Chip trạng thái */}
                        {isGraded && (
                          <div
                            style={{
                              ...styles.statusChip,
                              backgroundColor: isPassed
                                ? 'var(--color-success-bg)'
                                : 'var(--color-error-bg)',
                            }}>
                            <span
                              style={{
                                ...styles.statusChipText,
                                color: isPassed
                                  ? 'var(--color-success)'
                                  : 'var(--color-error)',
                              }}>
                              <span aria-hidden="true">
                                {isPassed ? '✓ ' : '✕ '}
                              </span>
                              {isPassed ? 'Đạt' : 'Chưa đạt'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Khung xem trước vùng ô (4 trạng thái: vGrid, vChart, vError, vReading) */}
                      {isOpen && (
                        <div
                          style={
                            isMobile
                              ? styles.previewWrapperMobile
                              : styles.previewWrapper
                          }>
                          <div style={styles.previewBox}>
                            {isChart ? (
                              /* 1. vChart: Tiêu chí biểu đồ */
                              <div style={styles.chartContainer}>
                                <div
                                  aria-hidden="true"
                                  style={styles.chartIconBadge}>
                                  <div style={styles.chartBar1} />
                                  <div style={styles.chartBar2} />
                                  <div style={styles.chartBar3} />
                                </div>
                                <div style={styles.chartTextCol}>
                                  <div style={styles.chartTitle}>
                                    Có biểu đồ: <strong>{inst?.summary}</strong>{' '}
                                    trên sheet {c.params?.sheet || 'Sheet1'}
                                  </div>
                                  <div style={styles.chartNote}>
                                    Đọc từ file bạn nộp. Khung xem không vẽ lại
                                    biểu đồ, chỉ hiện loại và tiêu đề.
                                  </div>
                                </div>
                              </div>
                            ) : gridData === 'reading' ? (
                              /* 2. vReading: đang tải/đọc file bài nộp */
                              <div style={styles.readingContainer}>
                                <div style={styles.readingStatusRow}>
                                  <Spin size="small" />
                                  <span style={styles.readingStatusText}>
                                    Đang đọc file bài nộp…
                                  </span>
                                </div>
                                <div style={styles.readingSkeletonGrid}>
                                  {[0, 1, 2, 3].map(r => (
                                    <div
                                      key={r}
                                      style={styles.readingSkeletonRow}>
                                      {[0, 1, 2, 3].map(col => (
                                        <div
                                          key={col}
                                          style={styles.readingSkeletonCell}
                                        />
                                      ))}
                                    </div>
                                  ))}
                                </div>
                                <span style={styles.readingNote}>
                                  File càng lớn càng lâu — kết quả chấm điểm ở
                                  trên đã có sẵn, không cần chờ khung này.
                                </span>
                              </div>
                            ) : gridData ? (
                              /* 3. vGrid: Đọc thành công hiện lưới ô và thanh công thức */
                              <div>
                                <div style={styles.gridTopBar}>
                                  <span style={styles.gridTopBarLeft}>
                                    Sheet{' '}
                                    <strong>
                                      {c.params?.sheet || 'Sheet1'}
                                    </strong>{' '}
                                    · vùng {gridData.rangeWin}
                                  </span>
                                  <span
                                    style={{
                                      ...styles.gridTopBarRight,
                                      color: isPassed
                                        ? 'var(--color-success)'
                                        : 'var(--color-error)',
                                    }}>
                                    <span aria-hidden="true">
                                      {isPassed ? '✓ ' : '✕ '}
                                    </span>
                                    Ô được chấm: {gridData.targetCell || 'Khóa'}{' '}
                                    · {isPassed ? 'Đạt' : 'Chưa đạt'}
                                  </span>
                                </div>

                                {/* Thanh công thức */}
                                <div style={styles.formulaBar}>
                                  <div style={styles.formulaCellAddr}>
                                    {gridData.activeCellAddr}
                                  </div>
                                  <div
                                    aria-hidden="true"
                                    style={styles.formulaFxLabel}>
                                    fx
                                  </div>
                                  <div style={styles.formulaInputDisplay}>
                                    {gridData.activeCellFormula}
                                  </div>
                                </div>

                                {/* Lưới bảng tính Excel */}
                                <div style={styles.tableScrollContainer}>
                                  <table style={styles.gridTable}>
                                    <thead>
                                      <tr>
                                        <th style={styles.gridThCorner} />
                                        {gridData.visibleCols.map(col => {
                                          const isColActive =
                                            gridData.activeCellAddr.startsWith(
                                              col,
                                            );
                                          return (
                                            <th
                                              key={col}
                                              style={{
                                                ...styles.gridThCol,
                                                ...(isColActive
                                                  ? styles.gridThColSelected
                                                  : {}),
                                              }}>
                                              {col}
                                            </th>
                                          );
                                        })}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {gridData.visibleRows.map(r => {
                                        const isRowActive =
                                          gridData.activeCellAddr.includes(
                                            String(r),
                                          );
                                        const isFreezeLine =
                                          gridData.ySplit === r;
                                        return (
                                          <tr key={r}>
                                            <th
                                              style={{
                                                ...styles.gridThRow,
                                                ...(isRowActive
                                                  ? styles.gridThRowSelected
                                                  : {}),
                                                borderBottomWidth: isFreezeLine
                                                  ? 2
                                                  : 1,
                                                borderBottomColor: isFreezeLine
                                                  ? 'var(--color-text-primary)'
                                                  : 'var(--color-border)',
                                              }}>
                                              {r}
                                            </th>
                                            {gridData.visibleCols.map(col => {
                                              const addr = `${col}${r}`;
                                              const cell =
                                                gridData.cellMap[addr];
                                              const isCellSelected =
                                                addr ===
                                                gridData.activeCellAddr;
                                              const isTarget =
                                                addr === gridData.targetCell;

                                              return (
                                                <td
                                                  key={addr}
                                                  onClick={() =>
                                                    setSelectedCells(prev => ({
                                                      ...prev,
                                                      [c._id || '']: addr,
                                                    }))
                                                  }
                                                  style={{
                                                    ...styles.gridCell,
                                                    textAlign:
                                                      cell?.align || 'left',
                                                    backgroundColor: isTarget
                                                      ? isPassed
                                                        ? 'var(--color-success-bg)'
                                                        : 'var(--color-error-bg)'
                                                      : isCellSelected
                                                        ? 'var(--color-surface-selected)'
                                                        : 'var(--color-surface)',
                                                    outline: isCellSelected
                                                      ? '2px solid var(--color-vhu-primary)'
                                                      : 'none',
                                                    outlineOffset: -2,
                                                  }}>
                                                  {cell?.value || ''}
                                                </td>
                                              );
                                            })}
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>

                                <div style={styles.gridFooter}>
                                  {gridData.ySplit
                                    ? `Đường đậm dưới hàng ${gridData.ySplit} = vùng cố định đọc từ file (ySplit = ${gridData.ySplit}). Màu/viền ô là mô phỏng.`
                                    : 'Giá trị, công thức và định dạng số đọc từ file bạn nộp. Màu nền, viền, font ô là mô phỏng theo giao diện LearnNest.'}
                                </div>
                              </div>
                            ) : (
                              /* 4. vError: lỗi đọc file, hoặc sheet trong tiêu chí không có trong file đã nộp */
                              <div style={styles.errorContainer}>
                                <div
                                  aria-hidden="true"
                                  style={styles.errorIconBadge}>
                                  <span style={styles.errorIconText}>!</span>
                                </div>
                                <div style={styles.errorTextCol}>
                                  <span style={styles.errorTitle}>
                                    Không thể hiển thị vùng ô
                                  </span>
                                  <span style={styles.errorBody}>
                                    {workbookError ||
                                      `Không tìm thấy sheet "${c.params?.sheet || ''}" trong file bạn đã nộp — kết quả chấm ở trên vẫn đúng, chỉ khung xem trước này không đọc được.`}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Hướng dẫn sửa lỗi */}
          {activeTab === 'fix' && (
            <div style={styles.fixContainer}>
              <p style={styles.fixIntro}>
                {fixCount} yêu cầu chưa đạt ở lần nộp gần nhất. Làm theo từng
                bước bên dưới rồi nộp lại file.
              </p>
              {failedCriteriaList.map(item => {
                const c = item.criterion;
                const inst = item.instruction;
                const isChart = c.type.includes('chart');

                // Tách các bước hướng dẫn
                const rawSteps =
                  item.result?.instruction || inst?.instruction || '';
                const stepLines = rawSteps
                  .split(/\r?\n/)
                  .map(s => s.trim())
                  .filter(Boolean);

                const steps =
                  stepLines.length > 0
                    ? stepLines
                    : [
                        `Mở file đề gốc và chọn đúng vị trí trên sheet ${c.params?.sheet || 'Sheet1'}.`,
                        `Thực hiện đúng yêu cầu: ${inst?.summary || PRACTICE_CRITERIA_LABELS[c.type]}.`,
                      ];

                return (
                  <article key={c._id || item.index} style={styles.fixArticle}>
                    <div style={styles.fixArticleHeader}>
                      <span style={styles.fixTitle}>
                        Yêu cầu {item.index + 1} ·{' '}
                        {PRACTICE_CRITERIA_LABELS[c.type] || c.type}
                      </span>
                      <div
                        style={{
                          ...styles.statusChip,
                          backgroundColor: 'var(--color-error-bg)',
                        }}>
                        <span
                          style={{
                            ...styles.statusChipText,
                            color: 'var(--color-error)',
                          }}>
                          ✕ Chưa đạt
                        </span>
                      </div>
                    </div>

                    <div style={styles.fixSummary}>
                      {inst?.summary ||
                        `Yêu cầu kiểm tra ${PRACTICE_CRITERIA_LABELS[c.type]}`}
                    </div>

                    <ol style={styles.fixStepList}>
                      {steps.map((st, sIdx) => (
                        <li key={sIdx} style={styles.fixStepItem}>
                          {st.startsWith('Bước')
                            ? st
                            : `Bước ${sIdx + 1}: ${st}`}
                        </li>
                      ))}
                    </ol>

                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('task');
                          setExpandedCriteriaId(c._id || null);
                        }}
                        style={{
                          ...styles.actionTextButton,
                          ...styles.actionTextButtonBlue,
                        }}>
                        <span>
                          {isChart
                            ? 'Xem thông tin biểu đồ trong bài làm →'
                            : 'Xem vùng ô trong bài làm →'}
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}

              <div style={styles.fixNoteFooter}>
                Hướng dẫn soạn sẵn theo từng loại tiêu chí. Yêu cầu đã đạt không
                hiện ở đây.
              </div>
            </div>
          )}

          {/* Khung thảo luận */}
          {!isMockExam && (
            <div style={styles.discussionSection}>
              <h3 style={styles.discussionTitle}>Thảo luận</h3>
              <CommentSection postId={taskId} type="PracticeTask" inline />
            </div>
          )}
        </div>

        {/* CỘT PHẢI (Aside): Nộp bài, Kết quả & Lịch sử */}
        <div
          style={{
            ...styles.sideColumn,
            ...(isMobile ? styles.sideColumnMobile : {}),
          }}>
          <div style={styles.asideCard}>
            {/* Hiển thị điểm số khi đã chấm (chỉ ngoài phiên thi thử) */}
            {isGraded && currentResult && (
              <div style={styles.scoreSection}>
                <span style={styles.scoreLabel}>Kết quả lần nộp gần nhất</span>
                <div style={styles.scoreRow}>
                  <span style={styles.scoreBig}>
                    {toScore10(
                      currentResult.totalScore,
                      currentResult.maxScore,
                    )}
                  </span>
                  <span style={styles.scoreTotal}>/10</span>
                  <div
                    style={{
                      ...styles.statusChip,
                      backgroundColor: currentResult.isPass
                        ? 'var(--color-success-bg)'
                        : 'var(--color-error-bg)',
                    }}>
                    <span
                      style={{
                        ...styles.statusChipText,
                        color: currentResult.isPass
                          ? 'var(--color-success)'
                          : 'var(--color-error)',
                      }}>
                      {currentResult.isPass ? '✓ Đạt' : '✕ Chưa đạt (cần ≥ 8)'}
                    </span>
                  </div>
                </div>
                <span style={styles.scoreNote}>
                  {currentResult.isPass
                    ? `${passedCriteriaCount}/${criteria.length} yêu cầu đạt. Đã mở khóa nội dung tiếp theo trong khóa học.`
                    : `${passedCriteriaCount}/${criteria.length} yêu cầu đạt. Cần tối thiểu 8 điểm để qua bài — xem tab Hướng dẫn sửa lỗi rồi nộp lại.`}
                </span>
              </div>
            )}

            {/* Thông tin nộp bài */}
            <div style={styles.uploadSubjectRow}>
              <div
                aria-hidden="true"
                style={{
                  ...styles.subjectIcon,
                  backgroundColor: subjectColor,
                }}>
                <span style={styles.subjectIconText}>{subjectLetter}</span>
              </div>
              <div style={styles.uploadTitleCol}>
                <span style={styles.uploadTitle}>
                  Nộp bài làm {task.subject}
                </span>
                <span style={styles.uploadHint}>
                  File {accept}, tối đa 20MB
                </span>
              </div>
            </div>

            {/* Nút hành động Tải file / Nộp bài trên Desktop */}
            {!isMobile && (
              <div style={styles.uploadBtnCol}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadStarter}
                  style={{ width: '100%', height: 40, borderRadius: 8 }}>
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
                      backgroundColor: 'var(--color-vhu-primary)',
                    }}>
                    {isSubmitting
                      ? 'Đang chấm bài…'
                      : isGraded
                        ? `Nộp lại (${accept})`
                        : `Nộp bài làm (${accept})`}
                  </Button>
                </Upload>
              </div>
            )}

            {/* Ghi chú trạng thái */}
            <div
              style={{
                ...styles.statusNoteBox,
                backgroundColor: isSubmitting
                  ? 'var(--color-info-bg)'
                  : 'var(--color-surface-subtle)',
              }}>
              <span aria-hidden="true">
                {isSubmitting ? '◌' : isMockExam ? '○' : 'ℹ'}
              </span>
              <span
                style={{
                  ...styles.statusNoteText,
                  color: isSubmitting
                    ? 'var(--color-info)'
                    : 'var(--color-text-body)',
                }}>
                {isSubmitting
                  ? 'Đã tải lên. Hệ thống đang chấm điểm, thường mất vài giây.'
                  : isMockExam
                    ? 'Chưa nộp bài này. Kết quả của từng bài chỉ hiện sau khi nộp bài thi.'
                    : isGraded
                      ? 'Nộp lại bất kỳ lúc nào — mỗi lần nộp được chấm và lưu vào lịch sử.'
                      : `${criteria.length} yêu cầu chấm điểm · cần đạt tối thiểu 8/10 để qua bài.`}
              </span>
            </div>
          </div>

          {/* Lịch sử nộp bài (chỉ hiển thị khi làm bài thực hành thường) */}
          {!isMockExam && submissions && submissions.length > 0 && (
            <div style={styles.historyCard}>
              <div style={styles.historyHeader}>
                Lịch sử nộp bài ({submissions.length} lần)
              </div>
              {submissions.map((s, idx) => {
                const sScore = toScore10(s.totalScore, s.maxScore);
                const sPass = sScore >= 8;
                return (
                  <div key={s._id} style={styles.historyRow}>
                    <span style={styles.historyTime}>
                      Lần {submissions.length - idx}
                    </span>
                    <span style={styles.historyScore}>{sScore}/10</span>
                    <div
                      style={{
                        ...styles.statusChip,
                        backgroundColor: sPass
                          ? 'var(--color-success-bg)'
                          : 'var(--color-error-bg)',
                      }}>
                      <span
                        style={{
                          ...styles.statusChipText,
                          color: sPass
                            ? 'var(--color-success)'
                            : 'var(--color-error)',
                        }}>
                        {sPass ? '✓ Đạt' : '✕ Chưa đạt'}
                      </span>
                    </div>
                    <span style={styles.historyTime}>
                      {dayjs(s.submittedAt).format('HH:mm DD/MM')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Thanh cố định dưới chân trang khi xem trên mobile */}
      {isMobile && (
        <div style={styles.bottomBarSticky}>
          <div style={{ flex: 1 }}>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadStarter}
              style={{ width: '100%', height: 44, borderRadius: 8 }}>
              Tải đề gốc
            </Button>
          </div>
          <div style={{ flex: 1.4 }}>
            <Upload {...uploadProps}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={isSubmitting}
                style={{
                  width: '100%',
                  height: 44,
                  borderRadius: 8,
                  backgroundColor: 'var(--color-vhu-primary)',
                }}>
                {isSubmitting ? 'Đang chấm…' : `Nộp bài (${accept})`}
              </Button>
            </Upload>
          </div>
        </div>
      )}
    </div>
  );
};

// Xuất ra ngoài để tái dùng đúng y hệt cách hiển thị "Yêu cầu N" ở trang kết
// quả thi thử (MockExamResultView) - tránh viết lại cùng 1 UI 2 lần.
export const ResultItemRow: React.FC<{
  item: PracticeSubmissionResultItem;
  index: number;
}> = ({ item, index }) => (
  <div style={styles.resultItemRow}>
    {item.passed ? (
      <CheckCircleFilled style={{ color: 'var(--color-success)' }} />
    ) : (
      <CloseCircleFilled style={{ color: 'var(--color-error)' }} />
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={styles.resultItemTitle}>Yêu cầu {index + 1}</div>
      {!item.passed && item.instruction && (
        <div style={styles.resultItemInstruction}>{item.instruction}</div>
      )}
    </div>
  </div>
);

export default PracticeTaskContent;
