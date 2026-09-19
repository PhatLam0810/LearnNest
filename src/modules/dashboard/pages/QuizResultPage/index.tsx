'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Skeleton } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import AppButton from '@components/AppButton';
import QuizAnswerReview from '@components/QuizAnswerReview';
import { useResponsive } from '@/styles/responsive';
import { dashboardQuery } from '~mdDashboard/redux';
import styles from './styles';

// Khung xương khớp bố cục thật: huy hiệu điểm + tiêu đề, rồi vài câu hỏi.
const QuizResultSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.skeletonHeader}>
      <Skeleton.Avatar active size={96} />
      <View style={styles.skeletonText}>
        <Skeleton active title paragraph={{ rows: 2 }} />
      </View>
    </View>
    {[0, 1, 2].map(i => (
      <View key={i} style={styles.skeletonQuestion}>
        <Skeleton active title={false} paragraph={{ rows: 1 }} />
        <Skeleton.Button active block />
        <Skeleton.Button active block />
      </View>
    ))}
  </View>
);

const QuizResultPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resultId } = useParams<{ resultId: string }>();
  const { isMobile } = useResponsive();

  const lessonId = searchParams.get('lessonId') || '';
  const subLessonId = searchParams.get('subLessonId') || '';

  const { data, error, isFetching, isError, refetch } =
    dashboardQuery.useGetMyQuizResultQuery(resultId, { skip: !resultId });
  const errorStatus =
    error && 'status' in error && typeof error.status === 'number'
      ? error.status
      : undefined;

  // Về đúng bài quiz vừa làm. Đạt -> quizDone=1 để trang bài học tự chuyển
  // sang nội dung kế tiếp; chưa đạt -> mở lại quiz để làm lại.
  const lessonHref = `/dashboard/home/lesson/moduleDetail?lessonId=${lessonId}&subLessonId=${subLessonId}`;
  // Mở thẳng URL kết quả không kèm lessonId thì không biết quay về bài nào ->
  // dẫn tới lịch sử kiểm tra.
  const goToLesson = (isPass: boolean) => {
    if (!lessonId) router.push('/dashboard/results');
    else router.push(isPass ? `${lessonHref}&quizDone=1` : lessonHref);
  };

  if (isFetching && !data) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <QuizResultSkeleton />
      </View>
    );
  }

  if (isError || !data) {
    // 403/404 thử lại vẫn ra kết quả cũ nên chỉ đưa nút quay về.
    const isForbidden = errorStatus === 403;
    const isNotFound = errorStatus === 404;
    const canRetry = !isForbidden && !isNotFound;
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View style={styles.errorPanel}>
          <Text role="heading" aria-level={1} style={styles.errorText}>
            {isForbidden
              ? 'Bạn không có quyền xem kết quả này'
              : isNotFound
                ? 'Không tìm thấy kết quả'
                : 'Không tải được kết quả bài tập.'}
          </Text>
          {canRetry && (
            <AppButton style={{ width: 'auto', height: 40 }} onClick={refetch}>
              Thử lại
            </AppButton>
          )}
          <AppButton
            type={canRetry ? undefined : 'primary'}
            style={{ width: 'auto', height: 40 }}
            onClick={() => goToLesson(false)}>
            {lessonId ? 'Về bài học' : 'Xem lịch sử kiểm tra'}
          </AppButton>
        </View>
      </View>
    );
  }

  const { isPass } = data;
  const StateIcon = isPass ? CheckCircleFilled : CloseCircleFilled;

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <View
            style={[
              styles.scoreBadge,
              isPass ? styles.scoreBadgePass : styles.scoreBadgeFail,
            ]}>
            <Text
              style={[
                styles.scoreValue,
                isPass ? styles.scorePass : styles.scoreFail,
              ]}>
              {data.score}
            </Text>
            <Text style={styles.scoreMax}>/10</Text>
          </View>
          <View style={styles.headerText}>
            <Text
              role="heading"
              aria-level={1}
              style={[
                styles.title,
                isMobile && styles.titleMobile,
                isPass ? styles.scorePass : styles.scoreFail,
              ]}>
              <StateIcon aria-hidden />
              {isPass ? ' Bạn đã đạt bài tập này' : ' Bạn chưa đạt bài tập này'}
            </Text>
            <Text style={styles.quizTitle}>{data.quizTitle}</Text>
            <Text style={styles.meta}>
              {`${data.correctCount}/${data.totalQuestions} câu đúng · Nộp lúc ${dayjs(
                data.createdAt,
              ).format('HH:mm DD/MM/YYYY')}`}
            </Text>
          </View>
        </View>

        {!!data.feedback && (
          <View style={styles.quoteBlock}>
            <Text style={styles.quoteLabel}>Nhận xét từ AI</Text>
            <Text style={styles.quoteText}>{data.feedback}</Text>
          </View>
        )}

        {data.hasAnswers ? (
          <QuizAnswerReview questions={data.questions} chooserLabel="Bạn" />
        ) : (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              {`Bài nộp này ghi nhận ${data.correctCount}/${data.totalQuestions} câu đúng, nhưng được nộp trước khi hệ thống lưu đáp án từng câu nên không thể hiển thị chi tiết.`}
            </Text>
          </View>
        )}

        <View style={[styles.actions, isMobile && styles.actionsMobile]}>
          <AppButton
            type="primary"
            style={{ width: isMobile ? '100%' : 'auto' }}
            onClick={() => goToLesson(isPass)}>
            {!lessonId
              ? 'Xem lịch sử kiểm tra'
              : isPass
                ? 'Tiếp tục bài học'
                : 'Làm lại bài tập'}
          </AppButton>
        </View>
      </View>
    </View>
  );
};

export default QuizResultPage;
