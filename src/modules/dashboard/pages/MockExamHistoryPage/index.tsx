'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Empty, Select, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useGetMyMockExamAttemptsQuery } from '~mdDashboard/redux';
import './styles.scss';

// recharts chỉ hiện khi có >= 2 lần thi (điều kiện bên dưới) - tách khỏi
// bundle chính, không bắt user chưa đủ dữ liệu tải thư viện chart vô ích.
const ScoreTrendChart = dynamic(() => import('./ScoreTrendChart'), {
  ssr: false,
});

const ALL = '__all__';

const MockExamHistoryPage: React.FC = () => {
  const router = useRouter();
  const { data, isFetching } = useGetMyMockExamAttemptsQuery();
  const [examFilter, setExamFilter] = useState<string>(ALL);

  const exams = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of data || []) map.set(a.examId, a.title);
    return [...map.entries()].map(([examId, title]) => ({ examId, title }));
  }, [data]);

  const filtered = useMemo(
    () =>
      (data || []).filter(a => examFilter === ALL || a.examId === examFilter),
    [data, examFilter],
  );

  const chartData = filtered.map((a, idx) => ({
    idx: idx + 1,
    label: dayjs(a.submittedAt).format('DD/MM'),
    score: a.overallScore,
  }));

  if (isFetching && !data) {
    return (
      <div className="meh-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="meh-page">
      <button
        type="button"
        className="meh-back"
        onClick={() => router.push('/dashboard/practice')}>
        ← Quay lại Luyện Tập
      </button>
      <h1 className="meh-heading">Lịch sử thi thử</h1>
      <p className="meh-sub">
        Toàn bộ các lần bạn đã nộp/hết giờ, kèm biểu đồ xu hướng điểm.
      </p>

      {(data || []).length === 0 ? (
        <Empty description="Bạn chưa hoàn thành phiên thi thử nào." />
      ) : (
        <>
          <div className="meh-toolbar">
            <Select
              value={examFilter}
              onChange={setExamFilter}
              style={{ minWidth: 260 }}
              options={[
                { value: ALL, label: 'Tất cả đề' },
                ...exams.map(e => ({ value: e.examId, label: e.title })),
              ]}
            />
          </div>

          {chartData.length >= 2 && (
            <div className="meh-chart">
              <ScoreTrendChart data={chartData} />
            </div>
          )}

          <div className="meh-list">
            {filtered.map(a => (
              <div
                key={a.attemptId}
                className="meh-row"
                role="button"
                tabIndex={0}
                onClick={() =>
                  router.push(`/dashboard/mock-exam/${a.attemptId}`)
                }>
                <span className="meh-row-date">
                  {dayjs(a.submittedAt).format('DD/MM/YYYY HH:mm')}
                </span>
                <span className="meh-row-title">{a.title}</span>
                {a.status === 'expired' && <Tag>Hết giờ</Tag>}
                <span className="meh-row-score">{a.overallScore}/10</span>
                <Tag color={a.overallIsPass ? 'success' : 'error'}>
                  {a.overallIsPass ? 'Đạt' : 'Chưa đạt'}
                </Tag>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MockExamHistoryPage;
