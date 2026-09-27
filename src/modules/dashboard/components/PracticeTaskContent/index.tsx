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
                  const whereStr = [
                    c.params?.sheet ? `Sheet ${c.params.sheet}` : null,
                    c.params?.cell ? `ô ${c.params.cell}` : null,
                    c.params?.range ? `vùng ${c.params.range}` : null,
                    c.params?.ySplit ? `cố định ${c.params.ySplit} hàng` : null,
                    c.type.includes('chart') ? 'biểu đồ' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ');

                  return (
                    <View key={c._id || idx} style={styles.criterionRow}>
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

                          {/* Chuyển tab sửa lỗi khi yêu cầu chưa đạt */}
                          {isGraded && isFailed && (
                            <View style={styles.actionsRow}>
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

                    <View style={{ marginTop: 8 }}>
                      <View
                        style={styles.goFixBtn}
                        onClick={() => setActiveTab('task')}
                        {...asButton(
                          () => setActiveTab('task'),
                          'Xem lại đề bài & nhiệm vụ',
                        )}>
                        <Text style={styles.goFixBtnText}>
                          ← Xem lại đề bài &amp; nhiệm vụ
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
