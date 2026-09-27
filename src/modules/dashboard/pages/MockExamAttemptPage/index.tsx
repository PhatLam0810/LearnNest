'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { View, Text } from 'react-native-web';
import { Button, Empty, Modal, Popconfirm, Spin, Statistic, Tag } from 'antd';
import { messageApi } from '@hooks';
import { dashboardQuery } from '~mdDashboard/redux';
import PracticeTaskContent, {
  ResultItemRow,
} from '~mdDashboard/components/PracticeTaskContent';
import CommentSection from '@components/CommentSection';
import { useResponsive } from '@/styles/responsive';
import { asButton } from '@/utils/asButton';
import styles from './styles';

const { Countdown } = Statistic;

type Props = { attemptId: string };

const subjectLabel = (s: string) => (s === 'Mixed' ? 'Word + Excel' : s);

// Trang thi thử - CÙNG 1 route cho cả lúc đang làm bài lẫn lúc xem kết quả,
// đổi render theo status của attempt (in_progress -> giao diện làm bài có
// tính giờ; submitted/expired -> kết quả tổng hợp) thay vì tách trang riêng,
// để hết giờ/nộp bài xong không cần điều hướng, chỉ cần refetch.
const MockExamAttemptPage: React.FC<Props> = ({ attemptId }) => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [showExitWarning, setShowExitWarning] = useState(false);
  const allowExitRef = React.useRef(false);
  const pendingNavUrl = React.useRef<string | null>(null);

  const { data, isFetching, refetch } =
    dashboardQuery.useGetMockExamAttemptQuery(attemptId, {
      skip: !attemptId,
    });
  const [submitAttempt, { isLoading: isSubmitting }] =
    dashboardQuery.useSubmitMockExamAttemptMutation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isTimeWarning, setIsTimeWarning] = useState(false);

  const isInProgress = data?.status === 'in_progress';

  // 1. Chặn close tab / reload khi đang thi
  useEffect(() => {
    if (!isInProgress) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (allowExitRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isInProgress]);

  // 2. Chặn nút Back / Forward của Chrome (popstate)
  useEffect(() => {
    if (!isInProgress) return;

    window.history.pushState({ mockExamGuard: true }, '', window.location.href);

    const onPopState = () => {
      if (allowExitRef.current) return;
      window.history.pushState(
        { mockExamGuard: true },
        '',
        window.location.href,
      );
      pendingNavUrl.current = '/dashboard/practice';
      setShowExitWarning(true);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [isInProgress]);

  // 3. Chặn mọi router navigation (cả khi click item trong sidebar dashboard, header, hay code gọi router.push/replace)
  useEffect(() => {
    if (!isInProgress) return;

    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(
      window.history,
    );

    const checkAndIntercept = (
      originalFn: (
        data: any,
        unused: string,
        url?: string | URL | null,
      ) => void,
      data: any,
      unused: string,
      url?: string | URL | null,
    ) => {
      if (allowExitRef.current) {
        return originalFn(data, unused, url);
      }

      if (url) {
        const dest = typeof url === 'string' ? url : url.toString();
        if (dest && !dest.includes(attemptId)) {
          pendingNavUrl.current = dest;
          setShowExitWarning(true);
          return;
        }
      }
      return originalFn(data, unused, url);
    };

    window.history.pushState = (data, unused, url) => {
      checkAndIntercept(originalPushState, data, unused, url);
    };

    window.history.replaceState = (data, unused, url) => {
      checkAndIntercept(originalReplaceState, data, unused, url);
    };

    // Bắt thêm click vào tất cả thẻ <a> (như các link trong sidebar dashboard)
    const handleAnchorClick = (e: MouseEvent) => {
      if (allowExitRef.current) return;
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        const url = new URL(target.href);
        if (!url.pathname.includes(attemptId)) {
          e.preventDefault();
          e.stopPropagation();
          pendingNavUrl.current = url.pathname + url.search;
          setShowExitWarning(true);
        }
      }
    };
    document.addEventListener('click', handleAnchorClick, true);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      document.removeEventListener('click', handleAnchorClick, true);
    };
  }, [isInProgress, attemptId]);

  // Tự chọn bài đầu tiên khi load xong đề
  useEffect(() => {
    if (data?.tasks && data.tasks.length > 0 && !activeTaskId) {
      setActiveTaskId(data.tasks[0].taskId);
    }
  }, [data?.tasks, activeTaskId]);

  // Kiểm tra cảnh báo thời gian (< 5 phút)
  useEffect(() => {
    if (!data?.deadline || !isInProgress) return;
    const checkTimer = () => {
      const remainingMs = new Date(data.deadline).getTime() - Date.now();
      setIsTimeWarning(remainingMs > 0 && remainingMs <= 5 * 60 * 1000);
    };
    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [data?.deadline, isInProgress]);

  const handleSubmit = async (isAutoExpire = false) => {
    try {
      await submitAttempt(attemptId).unwrap();
      allowExitRef.current = true;
      if (isAutoExpire) {
        messageApi.warning('Đã hết giờ làm bài! Hệ thống đã tự động nộp bài.');
      } else {
        messageApi.success('Đã nộp bài thi thử thành công!');
      }
      refetch();
    } catch {
      messageApi.error('Nộp bài thi thất bại, vui lòng thử lại');
    }
  };

  const handleConfirmExit = () => {
    allowExitRef.current = true;
    setShowExitWarning(false);
    const dest = pendingNavUrl.current || '/dashboard/practice';
    router.push(dest);
  };

  const handleCancelExit = () => {
    pendingNavUrl.current = null;
    setShowExitWarning(false);
  };

  if (isFetching && !data) {
    return (
      <View style={styles.loadingContainer}>
        <Spin size="large" />
      </View>
    );
  }
  if (!data) {
    return <Empty description="Không tìm thấy phiên thi thử" />;
  }

  if (data.status !== 'in_progress') {
    return <MockExamResultView attemptId={attemptId} />;
  }

  const subjectBg =
    data.subject === 'Excel'
      ? '#217346'
      : data.subject === 'Word'
        ? '#2b579a'
        : 'var(--color-vhu-primary)';
  const subjectLetter =
    data.subject === 'Excel' ? 'X' : data.subject === 'Word' ? 'W' : 'M';

  const submittedTasksCount = data.tasks.filter(t => t.submitted).length;
  const totalTasksCount = data.tasks.length;
  const progressPercent = Math.round(
    (submittedTasksCount / (totalTasksCount || 1)) * 100,
  );

  return (
    <View style={isMobile ? styles.pageMobile : styles.page}>
      {/* Modal cảnh báo thoát */}
      <Modal
        title="Thoát bài thi?"
        open={showExitWarning}
        okText="Thoát"
        cancelText="Tiếp tục thi"
        okButtonProps={{ danger: true }}
        onCancel={handleCancelExit}
        onOk={handleConfirmExit}>
        <p>
          Bài thi đang trong tiến trình. Nếu thoát bây giờ,{' '}
          <strong>kết quả các bài chưa nộp sẽ không được ghi nhận</strong>. Thời
          gian vẫn tiếp tục chạy.
        </p>
      </Modal>

      {/* Header trang thi thử */}
      <View style={isMobile ? styles.headerMobile : styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={styles.backButton}
            {...asButton(() => setShowExitWarning(true), 'Thoát bài thi')}>
            <Text style={styles.backButtonText}>← Thoát</Text>
          </View>

          <View
            aria-hidden="true"
            style={{
              ...styles.subjectIconBadge,
              backgroundColor: subjectBg,
            }}>
            <Text style={styles.subjectIconText}>{subjectLetter}</Text>
          </View>

          <View style={styles.titleCol}>
            <Text style={isMobile ? styles.titleMobile : styles.title}>
              {data.title}
            </Text>
            <Text style={styles.subtitle}>
              {subjectLabel(data.subject)} · {totalTasksCount} bài ·{' '}
              {data.durationMinutes} phút
            </Text>
          </View>
        </View>

        <View
          style={{
            ...styles.headerRight,
            ...(isMobile ? styles.headerRightMobile : {}),
          }}>
          {/* Thanh tiến độ nộp bài */}
          <View style={styles.progressBox}>
            <Text style={styles.progressText}>
              <strong style={{ fontWeight: '600' }}>
                {submittedTasksCount}/{totalTasksCount}
              </strong>{' '}
              đã nộp
            </Text>
            <View
              role="progressbar"
              aria-valuenow={submittedTasksCount}
              aria-valuemin={0}
              aria-valuemax={totalTasksCount}
              style={styles.progressBarTrack}>
              <View
                style={{
                  ...styles.progressBarFill,
                  width: `${progressPercent}%`,
                }}
              />
            </View>
          </View>

          {/* Đồng hồ đếm ngược */}
          <View
            role="timer"
            aria-label="Thời gian thi còn lại"
            style={{
              ...styles.timerBox,
              ...(isTimeWarning ? styles.timerBoxWarning : {}),
            }}>
            <Countdown
              value={new Date(data.deadline).getTime()}
              onFinish={() => handleSubmit(true)}
              valueStyle={{
                fontFamily: 'Lexend, sans-serif',
                fontSize: 16.4,
                fontWeight: 600,
                color: isTimeWarning
                  ? 'var(--color-warning)'
                  : 'var(--color-text-primary)',
              }}
            />
            <Text style={styles.timerLabel}>
              {isTimeWarning ? 'Sắp hết giờ' : 'còn lại'}
            </Text>
          </View>

          <Popconfirm
            title="Nộp bài thi thử?"
            description="Sau khi nộp sẽ không làm thêm được bài nào trong đề này nữa."
            okText="Nộp bài"
            cancelText="Làm tiếp"
            okButtonProps={{ danger: true, loading: isSubmitting }}
            onConfirm={() => handleSubmit(false)}>
            <Button
              type="primary"
              danger
              loading={isSubmitting}
              style={{ height: 40, borderRadius: 8, fontWeight: 500 }}>
              Nộp bài thi
            </Button>
          </Popconfirm>
        </View>
      </View>

      {/* Mobile Chips Navigation Bar */}
      {isMobile && (
        <View style={styles.chipsScrollRow}>
          {data.tasks.map((t, idx) => {
            const isActive = t.taskId === activeTaskId;
            return (
              <View
                key={t.taskId}
                style={[styles.chipItem, isActive && styles.chipItemActive]}
                {...asButton(
                  () => setActiveTaskId(t.taskId),
                  `Chuyển đến bài ${idx + 1}: ${t.title}`,
                )}>
                <Text style={styles.chipNumber}>Bài {idx + 1}</Text>
                {t.submitted ? (
                  <Text style={{ color: 'var(--color-success)', fontSize: 12 }}>
                    ✓
                  </Text>
                ) : (
                  <Text
                    style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                    ○
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Thân trang: Sidebar bên trái (Desktop), Nội dung bài ở giữa */}
      <View style={isMobile ? styles.bodyMobile : styles.body}>
        {!isMobile && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Bài trong đề</Text>
              <Text style={styles.sidebarCount}>
                {submittedTasksCount}/{totalTasksCount} đã nộp
              </Text>
            </View>
            <View style={styles.taskList}>
              {data.tasks.map((t, idx) => {
                const isActive = t.taskId === activeTaskId;
                return (
                  <View
                    key={t.taskId}
                    style={[styles.taskItem, isActive && styles.taskItemActive]}
                    {...asButton(
                      () => setActiveTaskId(t.taskId),
                      `Bài ${idx + 1}: ${t.title}`,
                    )}>
                    <View
                      style={[
                        styles.taskNumber,
                        isActive && styles.taskNumberActive,
                      ]}>
                      <Text
                        style={{
                          color: isActive
                            ? 'var(--color-text-on-primary)'
                            : 'var(--color-text-body)',
                          fontSize: 12,
                          fontWeight: '600',
                        }}>
                        {idx + 1}
                      </Text>
                    </View>
                    <Text style={styles.taskTitle}>{t.title}</Text>
                    {t.submitted ? (
                      <Tag
                        color="success"
                        style={{
                          margin: 0,
                          borderRadius: 10,
                          flexShrink: 0,
                        }}>
                        ✓ Đã nộp
                      </Tag>
                    ) : (
                      <Tag
                        style={{
                          margin: 0,
                          borderRadius: 10,
                          flexShrink: 0,
                        }}>
                        ○ Chưa làm
                      </Tag>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.contentArea}>
          {activeTaskId && (
            <PracticeTaskContent
              key={activeTaskId}
              taskId={activeTaskId}
              mockExamAttemptId={attemptId}
              onSubmitted={refetch}
            />
          )}
        </View>
      </View>
    </View>
  );
};

// Kết quả tổng hợp sau khi nộp/hết giờ - tổng điểm/10, đạt/chưa đạt từng
// bài, và với bài chưa đạt liệt kê từng tiêu chí sai kèm hướng dẫn sửa
const MockExamResultView: React.FC<{ attemptId: string }> = ({ attemptId }) => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { data, isFetching } =
    dashboardQuery.useGetMockExamResultQuery(attemptId);

  if (isFetching && !data) {
    return (
      <View style={styles.loadingContainer}>
        <Spin size="large" />
      </View>
    );
  }
  if (!data) return <Empty description="Không tìm thấy kết quả" />;

  return (
    <View style={isMobile ? styles.pageMobile : styles.page}>
      <View
        style={styles.backButton}
        {...asButton(
          () => router.push('/dashboard/practice'),
          'Quay lại Luyện Tập',
        )}>
        <Text style={styles.backButtonText}>← Quay lại Luyện Tập</Text>
      </View>

      {/* Card tổng điểm */}
      <View style={styles.resultHeaderCard}>
        <View style={styles.resultHeaderLeft}>
          <Text style={isMobile ? styles.titleMobile : styles.title}>
            {data.title} — Kết quả
          </Text>
          <Text style={styles.subtitle}>
            Đã làm {data.attemptedTasks}/{data.totalTasks} bài
            {data.status === 'expired' ? ' (hết giờ nộp tự động)' : ''}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={styles.resultScoreBadge}>
            <Text style={styles.resultScoreNum}>
              {data.overallScore.toFixed(1)}
            </Text>
            <Text style={styles.resultScoreTotal}>/10</Text>
          </View>
          <Tag
            color={data.overallIsPass ? 'success' : 'error'}
            style={{
              fontSize: 14,
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: 16,
              fontWeight: 600,
            }}>
            {data.overallIsPass ? '✓ Đạt' : '✕ Chưa đạt'}
          </Tag>
        </View>
      </View>

      {/* Danh sách từng bài thi trong đề */}
      {data.tasks.map((t, idx) => (
        <View key={t.taskId} style={styles.resultTaskCard}>
          <View style={styles.resultTaskHeader}>
            <Text style={styles.resultTaskTitle}>
              Bài {idx + 1}: {t.title}
            </Text>
            {!t.attempted ? (
              <Tag style={{ borderRadius: 10 }}>Chưa làm</Tag>
            ) : (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={styles.resultTaskScore}>
                  {t.score?.toFixed(1)}/10 điểm
                </Text>
                <Tag
                  color={t.isPass ? 'success' : 'error'}
                  style={{ borderRadius: 10 }}>
                  {t.isPass ? '✓ Đạt' : '✕ Chưa đạt'}
                </Tag>
              </View>
            )}
          </View>

          {t.attempted && t.results.length > 0 && (
            <View style={styles.resultCriteriaList}>
              {t.results.map((item, i) => (
                <ResultItemRow key={item.criteriaId} item={item} index={i} />
              ))}
            </View>
          )}
        </View>
      ))}

      {/* Thảo luận chung cho cả đề thi thử */}
      <View style={styles.discussionBox}>
        <Text style={styles.discussionTitle}>Thảo luận về đề thi này</Text>
        <CommentSection postId={data.examId} type="MockExam" inline />
      </View>
    </View>
  );
};

export default MockExamAttemptPage;
