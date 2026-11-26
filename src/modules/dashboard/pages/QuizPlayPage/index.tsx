'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Checkbox, Radio, Skeleton } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import AppButton from '@components/AppButton';
import { useResponsive } from '@/styles/responsive';
import ExamSidebar, {
  ExamItemState,
} from '~mdDashboard/components/ExamSidebar';
import { messageApi } from '@hooks';
import { dashboardQuery } from '~mdDashboard/redux';
import type {
  PlayQuestion,
  QuestionResponse,
  QuizSubmitResult,
} from '~mdDashboard/redux/RTKQuery/types';
import DragDropQuestion from './DragDropQuestion';
import styles from './styles';

type Responses = Record<number, QuestionResponse>;

const fmt = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

const isAnswered = (q: PlayQuestion, r?: QuestionResponse) =>
  q.type === 'dragdrop'
    ? Object.keys(r?.placements ?? {}).length === (q.blanks ?? 0)
    : (r?.selected?.length ?? 0) > 0;

const QuizPlayPage: React.FC = () => {
  const router = useRouter();
  const { quizId } = useParams<{ quizId: string }>();
  const {
    data: quiz,
    isFetching,
    isError,
    refetch,
  } = dashboardQuery.useGetPlayQuizQuery(quizId, {
    refetchOnMountOrArgChange: true,
  });
  const [submitQuiz, { isLoading: isSubmitting }] =
    dashboardQuery.useSubmitPlayQuizMutation();
  const [responses, setResponses] = useState<Responses>({});
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  // Bài không đặt giờ thì đếm lên thời gian đã làm.
  const [elapsed, setElapsed] = useState(0);
  const { isDesktop } = useResponsive();
  const submitted = useRef(false);

  const attemptsLeft = quiz?.maxAttempts
    ? quiz.maxAttempts - quiz.attemptsUsed
    : null;
  const outOfAttempts = attemptsLeft !== null && attemptsLeft <= 0;

  // Mỗi lần có đề mới (vào trang / làm lại) thì đặt lại bài làm + đồng hồ.
  useEffect(() => {
    if (!quiz) return;
    setResponses({});
    setResult(null);
    submitted.current = false;
    setSecondsLeft(quiz.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : null);
    setElapsed(0);
  }, [quiz?._id, quiz?.attemptsUsed]);

  useEffect(() => {
    if (!quiz || quiz.timeLimitMinutes || result) return;
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [quiz, result]);

  const setResponse = (index: number, patch: Partial<QuestionResponse>) =>
    setResponses(prev => ({
      ...prev,
      [index]: { ...prev[index], questionIndex: index, ...patch },
    }));

  const handleSubmit = async (auto = false) => {
    if (!quiz || submitted.current) return;
    submitted.current = true;
    try {
      const res = await submitQuiz({
        id: quiz._id,
        responses: Object.values(responses),
      }).unwrap();
      setResult(res);
      if (auto) messageApi.info('Hết giờ, bài đã được nộp tự động');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: unknown) {
      submitted.current = false;
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Nộp bài thất bại, thử lại nhé',
      );
    }
  };

  // Đồng hồ đếm ngược; hết giờ tự nộp phần đã làm.
  const submitRef = useRef(handleSubmit);
  submitRef.current = handleSubmit;
  useEffect(() => {
    if (secondsLeft === null || result || outOfAttempts) return;
    if (secondsLeft <= 0) {
      submitRef.current(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, result, outOfAttempts]);

  const reviewByIndex = useMemo(
    () => new Map((result?.review ?? []).map(r => [r.index, r])),
    [result],
  );

  if (isFetching && !quiz) {
    return (
      <View style={styles.page}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </View>
    );
  }
  if (isError || !quiz) {
    return (
      <View style={styles.page}>
        <View style={styles.centered}>
          <Text style={styles.meta}>Không tải được bài tập này.</Text>
          <AppButton style={styles.button} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      </View>
    );
  }

  const answeredCount = quiz.questions.filter(q =>
    isAnswered(q, responses[q.index]),
  ).length;

  return (
    <View style={styles.page}>
      <Text role="heading" aria-level={1} style={styles.title}>
        {quiz.title}
      </Text>
      <Text style={styles.meta}>
        {quiz.questions.length} câu · đạt từ {quiz.passThresholdPercent}%
        {attemptsLeft !== null
          ? ` · còn ${Math.max(attemptsLeft, 0)} lượt`
          : ''}
      </Text>

      {outOfAttempts && !result && (
        <View style={styles.scoreCard}>
          <Text style={styles.failed}>Bạn đã hết lượt làm bài này.</Text>
          <AppButton style={styles.button} onClick={() => router.back()}>
            Quay lại bài học
          </AppButton>
        </View>
      )}

      {result && (
        <View style={styles.scoreCard} role="status">
          <Text style={styles.scoreValue}>
            {result.correctCount}/{result.totalQuestions} câu đúng (
            {result.percent}%)
          </Text>
          <Text style={result.passed ? styles.passed : styles.failed}>
            {result.passed
              ? 'Chúc mừng, bạn đã đạt!'
              : `Chưa đạt (cần ${result.passThresholdPercent}%).`}
          </Text>
          <View style={styles.actions}>
            <AppButton style={styles.button} onClick={() => router.back()}>
              Quay lại bài học
            </AppButton>
            {(attemptsLeft === null || attemptsLeft > 1) && (
              <AppButton
                type="primary"
                style={styles.button}
                onClick={() => refetch()}>
                Làm lại
              </AppButton>
            )}
          </View>
        </View>
      )}

      <View
        style={{
          ...styles.layout,
          ...(isDesktop ? null : styles.layoutStack),
        }}>
        <View style={styles.main}>
          {!outOfAttempts &&
            quiz.questions.map((q, pos) => {
              const r = responses[q.index];
              const review = reviewByIndex.get(q.index);
              const locked = !!result;
              return (
                <View
                  key={q.index}
                  {...({ nativeID: `quiz-q-${pos}` } as object)}
                  style={{ ...styles.card, ...styles.cardAnchor }}>
                  <View style={styles.qHeader}>
                    <Text style={styles.qIndex}>{pos + 1}</Text>
                    {q.type !== 'dragdrop' && (
                      <Text style={styles.qText}>{q.questionText}</Text>
                    )}
                    {q.type === 'dragdrop' && (
                      <Text style={styles.qText}>Điền vào ô trống</Text>
                    )}
                  </View>
                  {review && (
                    <Text
                      style={review.correct ? styles.passed : styles.failed}>
                      {review.correct ? 'Đúng' : 'Chưa đúng'}
                    </Text>
                  )}

                  {q.type === 'single' && (
                    <Radio.Group
                      disabled={locked}
                      value={r?.selected?.[0]}
                      onChange={e =>
                        setResponse(q.index, { selected: [e.target.value] })
                      }
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}>
                      {q.answers.map((a, i) => {
                        const on = r?.selected?.includes(a.index) ?? false;
                        return (
                          <Radio
                            key={a.index}
                            value={a.index}
                            className="quiz-option"
                            style={{
                              ...styles.option,
                              ...(on ? styles.optionSelected : null),
                              ...(review?.correctIndexes?.includes(a.index)
                                ? styles.optionCorrect
                                : on && review
                                  ? styles.optionWrong
                                  : null),
                            }}>
                            <span
                              style={{
                                ...styles.letter,
                                ...(on ? styles.letterSelected : null),
                              }}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span style={styles.optionText}>{a.text}</span>
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  )}

                  {q.type === 'multiple' && (
                    <View style={{ gap: 8 }}>
                      <Text style={styles.qHint}>Chọn tất cả đáp án đúng</Text>
                      {q.answers.map(a => {
                        const on = r?.selected?.includes(a.index) ?? false;
                        return (
                          <Checkbox
                            key={a.index}
                            disabled={locked}
                            checked={on}
                            className="quiz-option"
                            style={{
                              ...styles.option,
                              ...(on ? styles.optionSelected : null),
                              ...(review?.correctIndexes?.includes(a.index)
                                ? styles.optionCorrect
                                : on && review
                                  ? styles.optionWrong
                                  : null),
                            }}
                            onChange={e => {
                              const cur = r?.selected ?? [];
                              setResponse(q.index, {
                                selected: e.target.checked
                                  ? [...cur, a.index]
                                  : cur.filter(i => i !== a.index),
                              });
                            }}>
                            <span style={styles.optionText}>{a.text}</span>
                          </Checkbox>
                        );
                      })}
                    </View>
                  )}

                  {q.type === 'dragdrop' && (
                    <DragDropQuestion
                      text={q.questionText}
                      answers={q.answers}
                      value={r?.placements ?? {}}
                      onChange={placements =>
                        setResponse(q.index, { placements })
                      }
                      review={review}
                    />
                  )}

                  {review?.explanation && (
                    <Text style={styles.explanation}>{review.explanation}</Text>
                  )}
                </View>
              );
            })}
        </View>
        {!outOfAttempts && (
          <View style={isDesktop ? styles.side : styles.sideStack}>
            <ExamSidebar
              timerLabel={
                secondsLeft !== null ? 'Thời gian còn lại' : 'Thời gian đã làm'
              }
              timerText={fmt(
                secondsLeft !== null ? Math.max(secondsLeft, 0) : elapsed,
              )}
              warn={secondsLeft !== null && secondsLeft <= 60 && !result}
              answeredCount={answeredCount}
              items={quiz.questions.map((q): ExamItemState => {
                const review = reviewByIndex.get(q.index);
                if (review) return review.correct ? 'correct' : 'wrong';
                return isAnswered(q, responses[q.index]) ? 'answered' : 'idle';
              })}
              onJump={pos =>
                document
                  .getElementById(`quiz-q-${pos}`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              onSubmit={result ? undefined : () => handleSubmit()}
              submitting={isSubmitting}
              compact={!isDesktop}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default QuizPlayPage;
