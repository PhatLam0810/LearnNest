'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Empty, Modal, Popconfirm, Spin, Statistic, Tag } from 'antd';
import { ArrowLeftOutlined, CheckCircleFilled } from '@components/AppIcon';
import { messageApi } from '@hooks';
import { dashboardQuery } from '~mdDashboard/redux';
import PracticeTaskContent, {
  ResultItemRow,
} from '~mdDashboard/components/PracticeTaskContent';
import CommentSection from '@components/CommentSection';
import { useResponsive } from '@/styles/responsive';
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
        const currentPath = window.location.pathname;
        let destPath = dest;
        try {
          const parsed = new URL(dest, window.location.origin);
          destPath = parsed.pathname;
        } catch {
          destPath = dest.split('?')[0];
        }

        if (destPath !== currentPath) {
          pendingNavUrl.current = dest;
          setShowExitWarning(true);
          return;
        }
      }

      return originalFn(data, unused, url);
    };

    window.history.pushState = function (data, unused, url) {
      return checkAndIntercept(originalPushState, data, unused, url);
    };

    window.history.replaceState = function (data, unused, url) {
      return checkAndIntercept(originalReplaceState, data, unused, url);
    };

    const onDocumentClick = (e: MouseEvent) => {
      if (allowExitRef.current) return;
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:'))
        return;

      let destPath = href;
      try {
        const parsed = new URL(href, window.location.origin);
        destPath = parsed.pathname;
      } catch {
        destPath = href.split('?')[0];
      }

      if (destPath !== window.location.pathname) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        pendingNavUrl.current = href;
        setShowExitWarning(true);
      }
    };

    document.addEventListener('click', onDocumentClick, true);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      document.removeEventListener('click', onDocumentClick, true);
    };
  }, [isInProgress]);

  useEffect(() => {
    if (data?.tasks?.length && !activeTaskId) {
      setActiveTaskId(data.tasks[0].taskId);
    }
  }, [data, activeTaskId]);

  // Cảnh báo thời gian còn dưới 5 phút
  useEffect(() => {
    if (!data?.deadline || !isInProgress) return;
    const checkTime = () => {
      const remaining = new Date(data.deadline).getTime() - Date.now();
      if (remaining <= 5 * 60 * 1000 && remaining > 0) {
        setIsTimeWarning(true);
      } else {
        setIsTimeWarning(false);
      }
    };
    checkTime();
    const interval = setInterval(checkTime, 10000);
    return () => clearInterval(interval);
  }, [data?.deadline, isInProgress]);

  const handleSubmit = async (auto: boolean) => {
    allowExitRef.current = true;
    try {
      await submitAttempt(attemptId).unwrap();
      if (auto) {
        messageApi.warning('Hết giờ! Bài thi thử đã được nộp tự động.');
      }
    } catch (e: any) {
      if (!auto) {
        messageApi.error(
          e?.data?.message || 'Nộp bài thi thất bại, vui lòng thử lại',
        );
      }
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
      <div style={styles.loadingContainer}>
        <Spin size="large" />
      </div>
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
    <div style={isMobile ? styles.pageMobile : styles.page}>
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
      <header style={isMobile ? styles.headerMobile : styles.header}>
        <div style={styles.headerLeft}>
          <button
            type="button"
            style={styles.backButton}
            onClick={() => setShowExitWarning(true)}
            aria-label="Thoát bài thi">
            <ArrowLeftOutlined />
            <span style={styles.backButtonText}>Thoát</span>
          </button>

          <div
            aria-hidden="true"
            style={{
              ...styles.subjectIconBadge,
              backgroundColor: subjectBg,
            }}>
            <span style={styles.subjectIconText}>{subjectLetter}</span>
          </div>

          <div style={styles.titleCol}>
            <h1 style={isMobile ? styles.titleMobile : styles.title}>
              {data.title}
            </h1>
            <span style={styles.subtitle}>
              {subjectLabel(data.subject)} · {totalTasksCount} bài ·{' '}
              {data.durationMinutes} phút
            </span>
          </div>
        </div>

        <div
          style={{
            ...styles.headerRight,
            ...(isMobile ? styles.headerRightMobile : {}),
          }}>
          {/* Thanh tiến độ nộp bài */}
          <div style={styles.progressBox}>
            <span style={styles.progressText}>
              <strong>
                {submittedTasksCount}/{totalTasksCount}
              </strong>{' '}
              đã nộp
            </span>
            <div
              role="progressbar"
              aria-valuenow={submittedTasksCount}
              aria-valuemin={0}
              aria-valuemax={totalTasksCount}
              style={styles.progressBarTrack}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>

          {/* Đồng hồ đếm ngược */}
          <div
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
            <span style={styles.timerLabel}>
              {isTimeWarning ? 'Sắp hết giờ' : 'còn lại'}
            </span>
          </div>

          <Popconfirm
            title="Nộp bài thi thử?"
            description="Sau khi nộp sẽ không làm thêm được bài nào trong đề này nữa."
            okText="Nộp bài"
            cancelText="Huỷ"
            onConfirm={() => handleSubmit(false)}>
            <Button
              type="primary"
              danger
              style={{ height: 40, borderRadius: 8, fontWeight: 500 }}
              loading={isSubmitting}>
              Nộp bài thi
            </Button>
          </Popconfirm>
        </div>
      </header>

      {/* Điều hướng danh sách câu hỏi dạng Chips trên Mobile */}
      {isMobile && (
        <nav aria-label="Danh sách bài trong đề" style={styles.chipsScrollRow}>
          {data.tasks.map((t, idx) => {
            const isActive = activeTaskId === t.taskId;
            return (
              <button
                key={t.taskId}
                type="button"
                onClick={() => setActiveTaskId(t.taskId)}
                style={{
                  ...styles.chipItem,
                  ...(isActive ? styles.chipItemActive : {}),
                }}>
                <span style={styles.chipNumber}>{idx + 1}</span>
                {t.submitted ? (
                  <CheckCircleFilled
                    style={{ color: 'var(--color-success)', fontSize: 13 }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: 12,
                      color: isActive
                        ? 'var(--color-vhu-primary)'
                        : 'var(--color-text-muted)',
                    }}>
                    {isActive ? '●' : '○'}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Thân trang: Sidebar danh sách bài (Desktop) & Nội dung bài tập */}
      <div
        style={{
          ...styles.body,
          ...(isMobile ? styles.bodyMobile : {}),
        }}>
        {!isMobile && (
          <nav aria-label="Danh sách bài trong đề" style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>Bài trong đề</span>
              <span style={styles.sidebarCount}>
                {submittedTasksCount}/{totalTasksCount} đã nộp
              </span>
            </div>
            <div style={styles.taskList}>
              {data.tasks.map((t, idx) => {
                const isActive = activeTaskId === t.taskId;
                return (
                  <button
                    key={t.taskId}
                    type="button"
                    onClick={() => setActiveTaskId(t.taskId)}
                    style={{
                      ...styles.taskItem,
                      ...(isActive ? styles.taskItemActive : {}),
                    }}>
                    <span
                      style={{
                        ...styles.taskNumber,
                        ...(isActive ? styles.taskNumberActive : {}),
                      }}>
                      {idx + 1}
                    </span>
                    <span style={styles.taskTitle}>{t.title}</span>
                    {t.submitted && (
                      <CheckCircleFilled
                        style={{
                          color: 'var(--color-success)',
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        <main style={styles.contentArea}>
          {activeTaskId && (
            <PracticeTaskContent
              key={activeTaskId}
              taskId={activeTaskId}
              mockExamAttemptId={attemptId}
              onSubmitted={refetch}
            />
          )}
        </main>
      </div>
    </div>
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
      <div style={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }
  if (!data) return <Empty description="Không tìm thấy kết quả" />;

  return (
    <div style={isMobile ? styles.pageMobile : styles.page}>
      <Button
        type="text"
        onClick={() => router.push('/dashboard/practice')}
        style={{
          alignSelf: 'flex-start',
          paddingLeft: 0,
          color: 'var(--color-vhu-primary)',
          fontWeight: 500,
        }}>
        ← Quay lại Luyện Tập
      </Button>

      {/* Card tổng điểm */}
      <div style={styles.resultHeaderCard}>
        <div style={styles.resultHeaderLeft}>
          <h1 style={isMobile ? styles.titleMobile : styles.title}>
            {data.title} — Kết quả
          </h1>
          <span style={styles.subtitle}>
            Đã làm {data.attemptedTasks}/{data.totalTasks} bài
            {data.status === 'expired' ? ' (hết giờ nộp tự động)' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={styles.resultScoreBadge}>
            <span style={styles.resultScoreNum}>
              {data.overallScore.toFixed(1)}
            </span>
            <span style={styles.resultScoreTotal}>/10</span>
          </div>
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
        </div>
      </div>

      {/* Danh sách từng bài thi trong đề */}
      {data.tasks.map((t, idx) => (
        <div key={t.taskId} style={styles.resultTaskCard}>
          <div style={styles.resultTaskHeader}>
            <span style={styles.resultTaskTitle}>
              Bài {idx + 1}: {t.title}
            </span>
            {!t.attempted ? (
              <Tag style={{ borderRadius: 10 }}>Chưa làm</Tag>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={styles.resultTaskScore}>
                  {t.score?.toFixed(1)}/10 điểm
                </span>
                <Tag
                  color={t.isPass ? 'success' : 'error'}
                  style={{ borderRadius: 10 }}>
                  {t.isPass ? '✓ Đạt' : '✕ Chưa đạt'}
                </Tag>
              </div>
            )}
          </div>

          {t.attempted && t.results.length > 0 && (
            <div style={styles.resultCriteriaList}>
              {t.results.map((item, i) => (
                <ResultItemRow key={item.criteriaId} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Thảo luận chung cho cả đề thi thử */}
      <div style={styles.discussionBox}>
        <h3 style={styles.discussionTitle}>Thảo luận về đề thi này</h3>
        <CommentSection postId={data.examId} type="MockExam" inline />
      </div>
    </div>
  );
};

export default MockExamAttemptPage;
