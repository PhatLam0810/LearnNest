'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Text, View } from 'react-native-web';
import { Button, Skeleton } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useAppSelector } from '@redux';
import { useResponsive } from '@/styles/responsive';
import { dashboardQuery } from '~mdDashboard/redux';
import { isTaskAccessible as checkTaskAccessible } from '~mdDashboard/utils/isTaskAccessible';
import { getLessonContentItems } from '~mdDashboard/utils/getLessonContentItems';
import PracticeTaskContent from '~mdDashboard/components/PracticeTaskContent';
import CurriculumRail, {
  CurriculumRailSkeleton,
} from '~mdDashboard/components/CurriculumRail';
import styles from './styles';

type Props = { lessonId: string };

// Trang "làm bài" của 1 khóa thực hành: rail bên phải liệt kê Phần > Bài
// (dùng chung CurriculumRail với trang moduleDetail của khóa học video), bấm
// bài nào thì nội dung + nộp bài của bài đó hiện bên trái.
const PracticeCourseDetailPage: React.FC<Props> = ({ lessonId }) => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const {
    data: lessonDetail,
    isLoading: isLoadingLesson,
    isError: isLessonError,
    refetch: refetchLesson,
  } = dashboardQuery.useGetLessonIdQuery({ id: lessonId }, { skip: !lessonId });
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isTasksError,
    refetch: refetchTasks,
  } = dashboardQuery.useGetPracticeTasksStudentQuery(
    { lessonId },
    { skip: !lessonId },
  );

  // Tiến độ để biết bài nào đã tới lượt — cùng 2 nguồn mà trang học đang
  // dùng, xem utils/isTaskAccessible.
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const isAdmin = userProfile?.role?.level <= 2;
  const { data: videoCompletedBySubLesson } =
    dashboardQuery.useGetMyLessonVideoProgressQuery(
      { userId: userProfile?._id || '', lessonId },
      { skip: !userProfile?._id || !lessonId },
    );
  const { data: quizPassedByLibrary } =
    dashboardQuery.useGetMyLessonQuizProgressQuery(
      { userId: userProfile?._id || '', lessonId },
      { skip: !userProfile?._id || !lessonId },
    );

  const isLoading = isLoadingLesson || isLoadingTasks;

  // Dãy nội dung khóa học theo đúng thứ tự hiển thị (library trộn với bài
  // thực hành theo order) — cần để biết mục nào đứng trước mỗi bài thực hành.
  const contentSeq = useMemo(
    () => getLessonContentItems(lessonDetail?.modules, tasks),
    [lessonDetail, tasks],
  );

  useEffect(() => {
    if (selectedTaskId || isLoading) return;
    // Mở sẵn bài đầu tiên ĐÃ mở khóa, không phải bài đầu danh sách — nếu
    // không, vào trang là tự chọn ngay một bài chưa tới lượt rồi hiện lỗi.
    const firstUnlocked = contentSeq.find(
      (it, idx) =>
        it.kind === 'task' &&
        checkTaskAccessible(contentSeq, idx, {
          isAdmin,
          videoCompletedBySubLesson,
          quizPassedByLibrary,
        }),
    );
    if (firstUnlocked) setSelectedTaskId(firstUnlocked.data._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedTaskId,
    isLoading,
    contentSeq,
    isAdmin,
    videoCompletedBySubLesson,
    quizPassedByLibrary,
  ]);

  const goBack = () => router.push('/dashboard/practice');

  const layoutRowStyle = [styles.layoutRow, isMobile && styles.layoutRowMobile];

  if (isLoading) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View style={layoutRowStyle}>
          <View style={[styles.mainColumn, styles.skeletonColumn]}>
            <Skeleton.Image
              active
              style={{ width: '100%', height: isMobile ? 200 : 400 }}
            />
            <Skeleton active paragraph={{ rows: 3 }} />
          </View>
          <CurriculumRailSkeleton />
        </View>
      </View>
    );
  }

  if (isLessonError || isTasksError) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            Không tải được khóa thực hành. Vui lòng thử lại.
          </Text>
          <Button
            type="primary"
            onClick={() => {
              if (isLessonError) refetchLesson();
              if (isTasksError) refetchTasks();
            }}>
            Thử lại
          </Button>
        </View>
      </View>
    );
  }

  if (!lessonDetail || !tasks?.length) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View style={styles.stateBox}>
          <Text style={styles.emptyText}>
            {lessonDetail
              ? 'Khóa thực hành này chưa có bài tập nào.'
              : 'Không tìm thấy khóa thực hành.'}
          </Text>
          <Button onClick={goBack}>Quay lại</Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <button type="button" style={styles.backBar} onClick={goBack}>
        <LeftOutlined style={styles.backBarIcon} />
        <Text style={styles.backBarText}>Quay lại</Text>
      </button>

      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>{lessonDetail.title}</Text>
      </View>

      <View style={layoutRowStyle}>
        <View style={styles.mainColumn}>
          {selectedTaskId ? (
            // key theo bài để đổi bài là dựng lại sạch, không giữ state bài cũ.
            <PracticeTaskContent
              key={selectedTaskId}
              taskId={selectedTaskId}
              onPassed={() => refetchTasks()}
            />
          ) : (
            <View style={styles.stateBox}>
              <Text style={styles.emptyText}>
                Hoàn thành nội dung trước đó trong khóa học để mở bài tập.
              </Text>
            </View>
          )}
        </View>
        {lessonDetail.modules?.length > 0 && (
          <CurriculumRail
            modules={lessonDetail.modules}
            tasks={tasks}
            videoCompletedBySubLesson={videoCompletedBySubLesson}
            quizPassedByLibrary={quizPassedByLibrary}
            isAdmin={isAdmin}
            currentUserId={userProfile?._id}
            selected={{ kind: 'task', id: selectedTaskId || '' }}
            onSelect={entry =>
              entry.kind === 'task'
                ? setSelectedTaskId(entry.data._id)
                : router.push(
                    `/dashboard/home/lesson/moduleDetail?lessonId=${lessonId}&subLessonId=${entry.data._id}`,
                  )
            }
          />
        )}
      </View>
    </View>
  );
};

export default PracticeCourseDetailPage;
