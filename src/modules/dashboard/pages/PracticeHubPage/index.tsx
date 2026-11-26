'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Empty, Input, Popconfirm, Skeleton, Tag } from 'antd';
import { ClockCircleOutlined, SearchOutlined } from '@components/AppIcon';
import type { PlayQuizSummary } from '~mdDashboard/redux/RTKQuery/types';
import { asButton } from '@/utils/asButton';
import { useRouter, useSearchParams } from 'next/navigation';
import { dashboardQuery } from '~mdDashboard/redux';
import {
  DEFAULT_PRACTICE_TAB,
  MOS_TAB,
  PracticeHubTab,
} from '~mdDashboard/constants/practiceSubjects';
import PracticeListPage from '../PracticeListPage';
import styles from './styles';

const quizMeta = (q: PlayQuizSummary) => {
  const left = q.maxAttempts ? q.maxAttempts - q.attemptsUsed : null;
  return {
    exhausted: left !== null && left <= 0,
    text: `${q.questionCount} câu · đạt từ ${q.passThresholdPercent}%${left !== null ? ` · còn ${Math.max(left, 0)} lượt` : ''}`,
  };
};

const StatusTag: React.FC<{ q: PlayQuizSummary }> = ({ q }) =>
  q.passed ? (
    <Tag color="success">Đạt {q.bestPercent}%</Tag>
  ) : q.bestPercent !== null ? (
    <Tag color="orange">Cao nhất {q.bestPercent}%</Tag>
  ) : null;

// Mục trắc nghiệm (AI, Tiếng Anh...) dùng cùng bố cục với Thực Hành MOS:
// Cần làm lại -> Đề thi thử (có giờ) -> Tất cả bài tập.
const SubjectQuizzes: React.FC<{ subject: string; label: string }> = ({
  subject,
  label,
}) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const { data, isFetching, isError } =
    dashboardQuery.useGetSubjectQuizzesQuery(subject, {
      refetchOnMountOrArgChange: true,
    });
  const open = (id: string) => router.push(`/dashboard/quiz/${id}`);
  const quizzes = data ?? [];
  const retry = quizzes.filter(q => q.attemptsUsed > 0 && !q.passed);
  const exams = quizzes.filter(q => q.timeLimitMinutes);
  const kw = keyword.trim().toLowerCase();
  const practice = quizzes.filter(
    q => !q.timeLimitMinutes && (!kw || q.title.toLowerCase().includes(kw)),
  );

  return (
    <div className="practice-list-page">
      <h1 className="practice-list-heading">Thực Hành {label}</h1>
      <p className="practice-list-subheading">
        Làm bài trắc nghiệm {label} — nộp bài để xem điểm, đáp án đúng và giải
        thích. Bạn có thể làm lại để cải thiện điểm.
      </p>

      {isFetching && !data ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : isError ? (
        <p className="practice-list-subheading">
          Không tải được danh sách bài tập.
        </p>
      ) : (
        <>
          {!!retry.length && (
            <div className="practice-retry-card">
              <h2 className="practice-retry-title">
                Cần làm lại ({retry.length})
              </h2>
              <p className="practice-retry-desc">
                Những bài bạn đã làm nhưng chưa đạt — làm lại để cải thiện điểm.
              </p>
              <div className="practice-retry-list">
                {retry.map(q => (
                  <div
                    key={q._id}
                    className="practice-retry-row"
                    {...asButton(() => open(q._id), q.title)}>
                    <Tag color="blue">{label}</Tag>
                    <span className="practice-retry-row-title">{q.title}</span>
                    {q.timeLimitMinutes ? (
                      <Tag color="purple">Đề thi thử</Tag>
                    ) : null}
                    <span className="practice-retry-row-meta">
                      Cao nhất {q.bestPercent ?? 0}% · cần{' '}
                      {q.passThresholdPercent}% · {q.attemptsUsed} lần thử
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!!exams.length && (
            <>
              <div className="practice-section-head">
                <h2 className="practice-list-subheading-2">Đề Thi Thử</h2>
              </div>
              <p className="practice-list-subheading">
                Thi có tính giờ, hết giờ tự nộp bài.
              </p>
              <div className="practice-task-grid" style={{ marginBottom: 24 }}>
                {exams.map(q => {
                  const m = quizMeta(q);
                  return (
                    <div key={q._id} className="practice-task-card">
                      <div className="practice-task-card-topbar">
                        <Tag color="blue">{label}</Tag>
                        <StatusTag q={q} />
                      </div>
                      <h3 className="practice-task-title">{q.title}</h3>
                      <div className="practice-mock-exam-meta">
                        <span>
                          <ClockCircleOutlined /> {q.timeLimitMinutes} phút
                        </span>
                        <span>{m.text}</span>
                      </div>
                      <Popconfirm
                        title="Bắt đầu đề thi thử?"
                        description="Sẽ tính giờ ngay từ lúc này, hết giờ tự nộp. Tiếp tục?"
                        okText="Bắt đầu"
                        cancelText="Huỷ"
                        disabled={m.exhausted}
                        onConfirm={() => open(q._id)}>
                        <Button
                          type="primary"
                          disabled={m.exhausted}
                          style={{ marginTop: 12 }}>
                          {m.exhausted ? 'Hết lượt' : 'Bắt đầu'}
                        </Button>
                      </Popconfirm>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Tìm bài tập theo tên..."
            aria-label="Tìm bài tập theo tên"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            style={{ maxWidth: 360, marginBottom: 16 }}
          />
          {!practice.length ? (
            <Empty
              description={
                kw
                  ? `Không tìm thấy bài tập nào khớp "${keyword.trim()}"`
                  : `Chưa có bài trắc nghiệm ${label} nào, quay lại sau nhé.`
              }
            />
          ) : (
            <>
              <div className="practice-list-toolbar">
                <h2 className="practice-list-subheading-2">
                  Tất cả bài tập ({practice.length})
                </h2>
              </div>
              <div className="practice-task-grid">
                {practice.map(q => {
                  const m = quizMeta(q);
                  return (
                    <div key={q._id} className="practice-task-card">
                      <div className="practice-task-card-topbar">
                        <Tag color="blue">{label}</Tag>
                        <StatusTag q={q} />
                      </div>
                      <h3 className="practice-task-title">
                        <button
                          type="button"
                          className="practice-task-title-btn"
                          disabled={m.exhausted}
                          onClick={() => open(q._id)}>
                          {q.title}
                        </button>
                      </h3>
                      <p className="practice-task-desc">{m.text}</p>
                      <Button
                        type="primary"
                        disabled={m.exhausted}
                        style={{ marginTop: 12 }}
                        onClick={() => open(q._id)}>
                        {m.exhausted
                          ? 'Hết lượt'
                          : q.attemptsUsed
                            ? 'Làm lại'
                            : 'Làm bài'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

// Trang Luyện tập chia theo mục (MOS, AI, ...): mục nào cũng nằm cùng 1 chỗ.
const PracticeHubPage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get('mode');
  const { data: subjects } = dashboardQuery.useGetPracticeHubTabsQuery();
  const tabs: PracticeHubTab[] = [
    MOS_TAB,
    ...(subjects ?? []).map(s => ({
      key: s.key,
      label: s.label,
      quizSubject: s.key,
    })),
  ];
  const active = tabs.find(t => t.key === requested) ?? MOS_TAB;

  return (
    <View>
      <View style={styles.bar}>
        <Text role="heading" aria-level={1} style={styles.title}>
          Luyện tập
        </Text>
        <View
          style={styles.tabs}
          {...({
            role: 'tablist',
            'aria-label': 'Chọn mục luyện tập',
          } as object)}>
          {tabs.map(t => {
            const selected = t.key === active.key;
            return (
              <View
                key={t.key}
                {...asButton(
                  () =>
                    router.replace(
                      t.key === DEFAULT_PRACTICE_TAB
                        ? '/dashboard/practice'
                        : `/dashboard/practice?mode=${t.key}`,
                      { scroll: false },
                    ),
                  t.label,
                )}
                {...({ role: 'tab', 'aria-selected': selected } as object)}
                style={{
                  ...styles.tab,
                  ...(selected ? styles.tabActive : null),
                }}>
                <Text
                  style={{
                    ...styles.tabText,
                    ...(selected ? styles.tabTextActive : null),
                  }}>
                  {t.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      {active.quizSubject ? (
        <SubjectQuizzes subject={active.quizSubject} label={active.label} />
      ) : (
        <PracticeListPage />
      )}
    </View>
  );
};

export default PracticeHubPage;
