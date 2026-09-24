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
import './styles.scss';

const { Countdown } = Statistic;

type Props = { attemptId: string };

const subjectLabel = (s: string) => (s === 'Mixed' ? 'Word + Excel' : s);

// Trang thi thử - CÙNG 1 route cho cả lúc đang làm bài lẫn lúc xem kết quả,
// đổi render theo status của attempt (in_progress -> giao diện làm bài có
// tính giờ; submitted/expired -> kết quả tổng hợp) thay vì tách trang riêng,
// để hết giờ/nộp bài xong không cần điều hướng, chỉ cần refetch.
const MockExamAttemptPage: React.FC<Props> = ({ attemptId }) => {
  const router = useRouter();
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

  const handleSubmit = async (auto: boolean) => {
    allowExitRef.current = true;
    try {
      // submitMockExamAttempt đã invalidatesTags MockExamAttempt - không
      // cần tự refetch(), useGetMockExamAttemptQuery tự tải lại.
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
      <div className="mock-exam-loading">
        <Spin />
      </div>
    );
  }
  if (!data) {
    return <Empty description="Không tìm thấy phiên thi thử" />;
  }

  if (data.status !== 'in_progress') {
    return <MockExamResultView attemptId={attemptId} />;
  }

  return (
    <div className="mock-exam-page">
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
      <div className="mock-exam-header">
        <div className="mock-exam-header-left">
          {/* Nút Back: hiện modal cảnh báo thay vì chuyển hướng ngay */}
          <button
            type="button"
            className="mock-exam-back-btn"
            onClick={() => setShowExitWarning(true)}
            aria-label="Thoát bài thi">
            <ArrowLeftOutlined />
            <span>Thoát</span>
          </button>
          <div className="mock-exam-title-row">
            <h1 className="mock-exam-title">{data.title}</h1>
            <Tag
              color={
                data.subject === 'Excel'
                  ? 'green'
                  : data.subject === 'Word'
                    ? 'blue'
                    : 'purple'
              }>
              {subjectLabel(data.subject)}
            </Tag>
          </div>
          <p className="mock-exam-subtitle">
            Hoàn thành và nộp bài trước khi thời gian kết thúc
          </p>
        </div>
        <div className="mock-exam-header-right">
          <div className="mock-exam-timer-wrap">
            <Countdown
              title="Thời gian còn lại"
              value={new Date(data.deadline).getTime()}
              onFinish={() => handleSubmit(true)}
            />
          </div>
          <Popconfirm
            title="Nộp bài thi thử?"
            description="Sau khi nộp sẽ không làm thêm được bài nào trong đề này nữa."
            okText="Nộp bài"
            cancelText="Huỷ"
            onConfirm={() => handleSubmit(false)}>
            <Button type="primary" danger size="large" loading={isSubmitting}>
              Nộp bài thi
            </Button>
          </Popconfirm>
        </div>
      </div>

      <div className="mock-exam-body">
        <div className="mock-exam-sidebar">
          <div className="mock-exam-sidebar-header">
            <span>Danh sách câu hỏi</span>
            <span className="mock-exam-sidebar-count">
              {data.tasks.filter(t => t.submitted).length}/{data.tasks.length}{' '}
              đã nộp
            </span>
          </div>
          {data.tasks.map((t, idx) => (
            <div
              key={t.taskId}
              className={
                'mock-exam-task-item' +
                (activeTaskId === t.taskId
                  ? ' mock-exam-task-item--active'
                  : '')
              }
              onClick={() => setActiveTaskId(t.taskId)}>
              <span className="mock-exam-task-number">{idx + 1}</span>
              <span className="mock-exam-task-item-title">{t.title}</span>
              {t.submitted && (
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
              )}
            </div>
          ))}
        </div>
        <div className="mock-exam-content">
          {activeTaskId && (
            <PracticeTaskContent
              key={activeTaskId}
              taskId={activeTaskId}
              mockExamAttemptId={attemptId}
              onSubmitted={refetch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Kết quả tổng hợp sau khi nộp/hết giờ - tổng điểm/10, đạt/chưa đạt từng
// bài, và với bài chưa đạt liệt kê từng tiêu chí sai kèm hướng dẫn sửa
// (tái dùng đúng cách hiển thị đã có ở PracticeTaskContent.ResultItemRow).
const MockExamResultView: React.FC<{ attemptId: string }> = ({ attemptId }) => {
  const router = useRouter();
  const { data, isFetching } =
    dashboardQuery.useGetMockExamResultQuery(attemptId);

  if (isFetching && !data) {
    return (
      <div className="mock-exam-loading">
        <Spin />
      </div>
    );
  }
  if (!data) return <Empty description="Không tìm thấy kết quả" />;

  return (
    <div className="mock-exam-page mock-exam-result">
      <Button
        type="text"
        onClick={() => router.push('/dashboard/practice')}
        style={{ marginBottom: 12 }}>
        ← Quay lại Luyện Tập
      </Button>
      <h1 className="mock-exam-title">{data.title} — Kết quả</h1>
      <p className="mock-exam-result-summary">
        Đã làm {data.attemptedTasks}/{data.totalTasks} bài
        {data.status === 'expired' ? ' (hết giờ)' : ''}
      </p>

      <div className="mock-exam-result-score-card">
        <div className="mock-exam-result-score">
          {data.overallScore.toFixed(1)}
          <span className="mock-exam-result-score-max">/10</span>
        </div>
        <Tag
          color={data.overallIsPass ? 'success' : 'error'}
          style={{ fontSize: 14 }}>
          {data.overallIsPass ? 'Đạt' : 'Chưa đạt'}
        </Tag>
      </div>

      {data.tasks.map((t, idx) => (
        <div key={t.taskId} className="mock-exam-result-task">
          <div className="mock-exam-result-task-header">
            <span>
              Bài {idx + 1}: {t.title}
            </span>
            {!t.attempted ? (
              <Tag>Chưa làm</Tag>
            ) : (
              <>
                <span className="mock-exam-result-task-score">
                  {t.score?.toFixed(1)}/10
                </span>
                <Tag color={t.isPass ? 'success' : 'error'}>
                  {t.isPass ? 'Đạt' : 'Chưa đạt'}
                </Tag>
              </>
            )}
          </div>
          {t.attempted && t.results.length > 0 && (
            <div className="mock-exam-result-criteria-list">
              {t.results.map((item, i) => (
                <ResultItemRow key={item.criteriaId} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Thảo luận CHUNG cho cả đề thi thử (khoá theo examId, mọi học viên
          cùng làm đề này chia sẻ 1 luồng) - không còn tách theo từng bài tập
          trong đề như trước. */}
      <div className="mock-exam-result-discussion">
        <h3>Thảo luận</h3>
        <CommentSection postId={data.examId} type="MockExam" inline />
      </div>
    </div>
  );
};

export default MockExamAttemptPage;
