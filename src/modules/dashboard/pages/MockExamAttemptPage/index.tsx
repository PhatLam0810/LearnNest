'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Empty, Popconfirm, Spin, Statistic, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { messageApi } from '@hooks';
import { dashboardQuery } from '~mdDashboard/redux';
import PracticeTaskContent from '~mdDashboard/components/PracticeTaskContent';
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
  const { data, isFetching, refetch } =
    dashboardQuery.useGetMockExamAttemptQuery(attemptId, { skip: !attemptId });
  const [submitAttempt, { isLoading: isSubmitting }] =
    dashboardQuery.useSubmitMockExamAttemptMutation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.tasks?.length && !activeTaskId) {
      setActiveTaskId(data.tasks[0].taskId);
    }
  }, [data, activeTaskId]);

  const handleSubmit = async (auto: boolean) => {
    try {
      await submitAttempt(attemptId).unwrap();
      if (auto) {
        messageApi.warning('Hết giờ! Bài thi thử đã được nộp tự động.');
      }
      refetch();
    } catch (e: any) {
      if (!auto) {
        messageApi.error(
          e?.data?.message || 'Nộp bài thi thất bại, vui lòng thử lại',
        );
      }
    }
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
      <div className="mock-exam-header">
        <div>
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
        <div className="mock-exam-header-right">
          <Countdown
            title="Thời gian còn lại"
            value={new Date(data.deadline).getTime()}
            onFinish={() => handleSubmit(true)}
          />
          <Popconfirm
            title="Nộp bài thi thử?"
            description="Sau khi nộp sẽ không làm thêm được bài nào trong đề này nữa."
            okText="Nộp bài"
            cancelText="Huỷ"
            onConfirm={() => handleSubmit(false)}>
            <Button danger loading={isSubmitting}>
              Nộp bài thi
            </Button>
          </Popconfirm>
        </div>
      </div>

      <div className="mock-exam-body">
        <div className="mock-exam-sidebar">
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
              <span className="mock-exam-task-item-title">
                Bài {idx + 1}: {t.title}
              </span>
              {t.submitted && (
                <CheckCircleFilled style={{ color: '#52c41a' }} />
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
          {t.failedCriteria.length > 0 && (
            <div className="mock-exam-result-failed-list">
              {t.failedCriteria.map((f, i) => (
                <div key={i} className="mock-exam-result-failed-item">
                  <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                  <span>{f.instruction || 'Chưa đạt yêu cầu này'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MockExamAttemptPage;
