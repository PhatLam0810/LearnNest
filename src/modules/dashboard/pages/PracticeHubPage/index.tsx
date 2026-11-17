'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Segmented, Skeleton } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { dashboardQuery } from '~mdDashboard/redux';
import { QuizSummaryItems } from '~mdDashboard/components/LibraryQuizList';
import {
  DEFAULT_PRACTICE_TAB,
  PRACTICE_HUB_TABS,
} from '~mdDashboard/constants/practiceSubjects';
import PracticeListPage from '../PracticeListPage';
import styles from './styles';

const SubjectQuizzes: React.FC<{ subject: string; label: string }> = ({
  subject,
  label,
}) => {
  const { data, isFetching, isError } =
    dashboardQuery.useGetSubjectQuizzesQuery(subject, {
      refetchOnMountOrArgChange: true,
    });
  return (
    <View style={styles.quizWrap}>
      {isFetching && !data ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : isError ? (
        <Text style={styles.hint}>Không tải được danh sách bài tập.</Text>
      ) : !data?.length ? (
        <Text style={styles.hint}>
          Chưa có bài trắc nghiệm {label} nào, quay lại sau nhé.
        </Text>
      ) : (
        <QuizSummaryItems quizzes={data} />
      )}
    </View>
  );
};

// Trang Luyện tập chia theo mục (MOS, AI, ...): mục nào cũng nằm cùng 1 chỗ.
const PracticeHubPage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get('mode');
  const active =
    PRACTICE_HUB_TABS.find(t => t.key === requested) ??
    PRACTICE_HUB_TABS.find(t => t.key === DEFAULT_PRACTICE_TAB)!;

  return (
    <View>
      <View style={styles.bar}>
        <Text role="heading" aria-level={1} style={styles.title}>
          Luyện tập
        </Text>
        <Segmented
          aria-label="Chọn mục luyện tập"
          value={active.key}
          options={PRACTICE_HUB_TABS.map(t => ({
            value: t.key,
            label: t.label,
          }))}
          onChange={v =>
            router.replace(
              v === DEFAULT_PRACTICE_TAB
                ? '/dashboard/practice'
                : `/dashboard/practice?mode=${v}`,
              { scroll: false },
            )
          }
        />
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
