'use client';
import React, { useEffect, useState } from 'react';
import { CheckOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Text, View } from 'react-native-web';
import { Modal, Skeleton } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import AppModalSuccess from '@components/AppModalSuccess';
import BookmarkButton from '@components/BookmarkButton';
import CommentCountBadge from '@components/CommentCountBadge';
import CourseRatingSection from '@components/CourseRatingSection';
import { useAppDispatch, useAppSelector } from '@redux';
import { LessonThumbnail } from '~mdDashboard/components';
import AppVideoWatchers from '~mdDashboard/components/VideoWatchersList/AppVideoWatchers';
import AppVideoWatchersButton from '~mdDashboard/components/VideoWatchersList/AppVideoWatchersButton';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { isTaskAccessible as checkTaskAccessible } from '~mdDashboard/utils/isTaskAccessible';
import { authAction } from '~mdAuth/redux';
import { useResponsive } from '@/styles/responsive';
import { convertDurationToTime } from '@utils/time';
import styles from './styles';
import { messageApi } from '@hooks';

interface LessonDetailPageProps {
  id: string;
}

type ContentEntry = { kind: 'library' | 'task'; data: any; order?: number };

const LessonDetailPage = ({ id }: LessonDetailPageProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { lessonPurchaseData } = useAppSelector(state => state.authReducer);
  const contextHolder = null;
  const {
    data: lessonDetail,
    isLoading,
    isError,
    refetch,
  } = dashboardQuery.useGetLessonIdQuery({ id });
  const [isVisibleModalSuccess, setIsVisibleModalSuccess] = useState(false);
  // Dùng chung cache với CourseRatingSection (cùng 1 lessonId) - RTK Query
  // gộp lại thành 1 request, không gọi API 2 lần.
  const { data: ratingSummary } = dashboardQuery.useGetCourseRatingQuery(
    id || '',
    { skip: !id },
  );
  // Trạng thái "đã lưu" ban đầu suy 1 lần cho cả trang, BookmarkButton tự giữ
  // state optimistic sau đó (đúng pattern ở ModuleDetailPage/PracticeTaskContent).
  const { data: bookmarkedSubIds } =
    dashboardQuery.useGetBookmarkIdsQuery('sublesson');
  const { data: bookmarkedTaskIds } =
    dashboardQuery.useGetBookmarkIdsQuery('practiceTask');
  const [setLibraryCanPlay] = dashboardQuery.useSetLibraryCanPlayMutation();
  const [triggerAccessLesson] = dashboardQuery.useAccessLessonMutation();
  const [checkRegistrationLesson] =
    dashboardQuery.useCheckRegistrationLessonMutation();
  const lessonLibraries =
    lessonDetail?.modules?.flatMap(module => module.libraries ?? []) ?? [];
  const hasContent = lessonLibraries.length > 0;

  // "Khóa thực hành" (MOS practice) dùng lại đúng Lesson/Module này — nếu
  // KHÔNG có video nào thì tự chuyển sang đúng trang làm bài thực hành; nếu
  // khóa có CẢ video lẫn bài thực hành (nội dung trộn) thì fetch để trộn vào
  // đúng chỗ trong "Nội dung khóa học" bên dưới.
  const { data: practiceTasksOfLesson } =
    dashboardQuery.useGetPracticeTasksStudentQuery(
      { lessonId: id },
      { skip: !id },
    );
  // Bài thực hành đứng ngay sau 1 video chỉ mở khóa được nếu video đó đã
  // XEM XONG (VideoTracking.completed) — xem isTaskAccessible.
  const { data: videoCompletedBySubLesson } =
    dashboardQuery.useGetMyLessonVideoProgressQuery(
      { userId: userProfile?._id || '', lessonId: id },
      { skip: !userProfile?._id || !id },
    );
  // Tương tự nhưng cho quiz (ResultTest.isPass).
  const { data: quizPassedByLibrary } =
    dashboardQuery.useGetMyLessonQuizProgressQuery(
      { userId: userProfile?._id || '', lessonId: id },
      { skip: !userProfile?._id || !id },
    );
  useEffect(() => {
    // Đợi lessonDetail tải xong hẳn mới xét — nếu không, hasContent tạm
    // thời là false trong lúc còn undefined, gây redirect nhầm sang trang
    // thực hành dù khóa thật sự có video.
    if (isLoading) return;
    if (
      !hasContent &&
      practiceTasksOfLesson &&
      practiceTasksOfLesson.length > 0
    ) {
      router.replace(`/dashboard/practice/course/${id}`);
    }
  }, [isLoading, hasContent, practiceTasksOfLesson, id, router]);

  const { isMobile, isTablet } = useResponsive();

  const [watcherModalVisible, setWatcherModalVisible] = useState(false);
  const [selectedSubLessonId, setSelectedSubLessonId] = useState<string | null>(
    null,
  );
  const [selectedSubLessonTitle, setSelectedSubLessonTitle] =
    useState<string>('');

  useEffect(() => {
    if (!lessonDetail || lessonDetail.modules.length === 0) return;

    const firstLibrary = lessonDetail.modules[0].libraries?.[0];
    if (firstLibrary) {
      setLibraryCanPlay({
        libraryId: firstLibrary._id,
        userId: userProfile?._id,
      });
    }
  }, [lessonDetail, setLibraryCanPlay, userProfile?._id]);

  useEffect(() => {
    if (lessonPurchaseData) {
      setIsVisibleModalSuccess(true);
    }
  }, [lessonPurchaseData]);

  const isAdmin = (userProfile?.role?.level ?? 99) <= 2;

  const hasAccessToLibrary = (library: any) => {
    if (!library) return false;
    return (
      isAdmin ||
      library?.usersCanPlay?.some(user => user._id === userProfile?._id)
    );
  };

  const handleLibraryClick = (subItem: any, item: any) => {
    if (isAdmin && subItem.type === 'Text') {
      router.push(
        `/dashboard/home/lesson/resultHistory?libraryId=${subItem?._id}`,
      );
      return;
    }

    if (hasAccessToLibrary(subItem)) {
      dispatch(dashboardAction.setSelectedModule(item));
      dispatch(dashboardAction.setSelectedLibrary(subItem));
      router.push(
        `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail?._id}`,
      );
    }
  };

  // Đã học xong mục này chưa - cùng logic với isTaskAccessible (dùng
  // videoCompletedBySubLesson/quizPassedByLibrary), tách riêng vì cần dùng
  // độc lập để tính % tiến độ + tìm "bài tiếp theo", không chỉ để khoá/mở.
  const isItemCompleted = (item: ContentEntry) => {
    if (item.kind === 'task') return !!item.data.hasPassed;
    if (item.data.type === 'Text') {
      return !!quizPassedByLibrary?.[item.data._id];
    }
    return !!videoCompletedBySubLesson?.[item.data._id];
  };

  // Trộn bài học video (order = vị trí trong module.libraries[]) với bài
  // thực hành thuộc module này (order = field riêng) — 1 khóa học có thể
  // chứa cả 2 loại nội dung xen kẽ theo đúng thứ tự admin đã sắp xếp.
  const getModuleContentItems = (moduleItem: any): ContentEntry[] => {
    const libraryItems = (moduleItem.libraries || []).map(
      (l: any, i: number) => ({ kind: 'library' as const, data: l, order: i }),
    );
    const taskItems = (practiceTasksOfLesson || [])
      .filter(t => t.moduleId === moduleItem._id)
      .map(t => ({ kind: 'task' as const, data: t, order: t.order ?? 0 }));
    return [...libraryItems, ...taskItems].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
  };

  // Toàn bộ nội dung khóa học theo 1 thứ tự duy nhất (nối các module theo
  // đúng thứ tự) — dùng để khoá bài thực hành chưa tới lượt và đánh số bài.
  const lessonSeq: ContentEntry[] = (lessonDetail?.modules || []).flatMap(m =>
    getModuleContentItems(m),
  );
  const totalContentCount = lessonSeq.length;
  const completedContentCount = lessonSeq.filter(isItemCompleted).length;
  const progressPercent =
    totalContentCount > 0
      ? Math.round((completedContentCount / totalContentCount) * 100)
      : 0;
  const firstIncompleteContentIndex = lessonSeq.findIndex(
    it => !isItemCompleted(it),
  );
  const continueButtonLabel =
    completedContentCount > 0 && firstIncompleteContentIndex >= 0
      ? `Tiếp tục bài ${firstIncompleteContentIndex + 1}`
      : 'Bắt đầu khóa học';

  // Logic thật nằm ở utils/isTaskAccessible.ts (dùng chung với
  // ModuleDetailPage, có test riêng).
  const isTaskAccessible = (seq: ContentEntry[], idx: number) =>
    checkTaskAccessible(seq, idx, {
      isAdmin,
      videoCompletedBySubLesson,
      quizPassedByLibrary,
    });

  const handleStartLesson = async () => {
    if (!userProfile?._id || !lessonDetail?._id) {
      messageApi.open({
        type: 'error',
        content:
          'Không xác định được người dùng hoặc bài học, vui lòng tải lại trang.',
        duration: 5,
      });
      return;
    }

    dispatch(authAction.setIsShowLoading(true));
    try {
      const result = await checkRegistrationLesson({
        userId: userProfile._id,
        lessonId: lessonDetail._id,
      }).unwrap();

      if (!result.isRegisterLesson) {
        await triggerAccessLesson({
          userId: userProfile._id,
          lessonId: lessonDetail._id,
        });
      }

      // "Tiếp tục" phải nhảy tới mục CHƯA HOÀN THÀNH đầu tiên, không phải
      // luôn về mục đầu khóa - fallback về mục đầu nếu đã xong hết hoặc chưa
      // có dữ liệu tiến độ nào.
      let targetModule: any = null;
      let targetItem: ContentEntry | null = null;
      let fallbackModule: any = null;
      let fallbackItem: ContentEntry | null = null;
      for (const m of lessonDetail.modules || []) {
        const items = getModuleContentItems(m);
        if (items.length === 0) continue;
        if (!fallbackModule) {
          fallbackModule = m;
          fallbackItem = items[0];
        }
        const incomplete = items.find(it => !isItemCompleted(it));
        if (incomplete) {
          targetModule = m;
          targetItem = incomplete;
          break;
        }
      }
      if (!targetItem) {
        targetModule = fallbackModule;
        targetItem = fallbackItem;
      }

      if (!targetModule || !targetItem) {
        messageApi.open({
          type: 'error',
          content: 'Khóa học này hiện chưa có nội dung.',
          duration: 5,
        });
        return;
      }

      if (targetItem.kind === 'task') {
        router.push(
          `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail._id}&taskId=${targetItem.data._id}`,
        );
      } else {
        dispatch(dashboardAction.setSelectedModule(targetModule));
        dispatch(dashboardAction.setSelectedLibrary(targetItem.data));
        router.push(
          `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail._id}`,
        );
      }
    } catch (error) {
      console.error('handleStartLesson error:', error);
      messageApi.open({
        type: 'error',
        content: 'Vui lòng thử lại.',
        duration: 5,
      });
    } finally {
      dispatch(authAction.setIsShowLoading(false));
    }
  };

  const renderRow = (entry: ContentEntry, moduleItem: any) => {
    const idx = lessonSeq.indexOf(entry);
    const isTask = entry.kind === 'task';
    const data = entry.data;
    const locked = isTask
      ? !isTaskAccessible(lessonSeq, idx)
      : !hasAccessToLibrary(data);
    const completed = isItemCompleted(entry);
    const current =
      !completed && !locked && idx === firstIncompleteContentIndex;
    const stateLabel = completed ? 'Đã xong' : current ? 'Đang học' : 'Chưa mở';
    const meta = isTask
      ? `Bài thực hành ${data.subject}`
      : data.type !== 'Text'
        ? convertDurationToTime(data.duration)
        : 'Trắc nghiệm';

    const open = () => {
      if (locked) return;
      if (isTask) {
        router.push(
          `/dashboard/home/lesson/moduleDetail?lessonId=${lessonDetail?._id}&taskId=${data._id}`,
        );
        return;
      }
      handleLibraryClick(data, moduleItem);
    };

    return (
      <View key={data._id} style={styles.row}>
        <button
          type="button"
          disabled={locked}
          onClick={open}
          style={{
            ...(styles.rowMain as React.CSSProperties),
            ...((locked ? styles.rowMainLocked : {}) as React.CSSProperties),
          }}>
          <View
            style={{
              ...styles.chip,
              ...(completed
                ? styles.chipDone
                : current
                  ? styles.chipCurrent
                  : {}),
            }}>
            {completed ? (
              <CheckOutlined aria-hidden style={styles.chipTextDone} />
            ) : (
              <Text
                style={{
                  ...styles.chipText,
                  ...(current ? styles.chipTextCurrent : {}),
                }}>
                {idx + 1}
              </Text>
            )}
          </View>
          <View style={styles.rowText}>
            <Text numberOfLines={2} style={styles.rowTitle}>
              {data.title}
            </Text>
            <Text style={styles.rowMeta}>{meta}</Text>
          </View>
        </button>
        <View style={styles.rowActions}>
          <CommentCountBadge postId={data._id} />
          <BookmarkButton
            itemType={isTask ? 'practiceTask' : 'sublesson'}
            itemId={data._id}
            lessonId={isTask ? undefined : lessonDetail?._id}
            bookmarked={(
              (isTask ? bookmarkedTaskIds : bookmarkedSubIds) || []
            ).includes(data._id)}
            size={18}
          />
          {isAdmin && !isTask && data.type !== 'Text' && (
            <AppVideoWatchersButton
              subLessonId={data._id}
              subLessonTitle={data.title}
              onClick={e => {
                e.stopPropagation();
                setSelectedSubLessonId(data._id);
                setSelectedSubLessonTitle(data.title);
                setWatcherModalVisible(true);
              }}
            />
          )}
          <Text
            style={{
              ...styles.stateText,
              ...(completed
                ? styles.stateDone
                : current
                  ? styles.stateCurrent
                  : styles.stateIdle),
            }}>
            {stateLabel}
          </Text>
        </View>
      </View>
    );
  };

  const curriculum = (
    <View style={styles.curriculum}>
      <View style={styles.curriculumHeader}>
        <Text style={styles.cardTitle}>Nội dung khóa học</Text>
      </View>
      {lessonSeq.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Khóa học này chưa có nội dung. Vui lòng quay lại sau.
          </Text>
        </View>
      ) : (
        (lessonDetail?.modules || []).map(moduleItem => {
          const entries = getModuleContentItems(moduleItem);
          return (
            <View key={moduleItem._id}>
              <View style={styles.moduleHeader}>
                <Text style={styles.moduleTitle} numberOfLines={1}>
                  {moduleItem.title}
                </Text>
                <Text
                  style={styles.moduleCount}>{`${entries.length} bài`}</Text>
              </View>
              {entries.map(entry => renderRow(entry, moduleItem))}
            </View>
          );
        })
      )}
    </View>
  );

  const progressCard = (
    <View style={styles.card}>
      {hasContent && totalContentCount > 0 && (
        <View style={{ gap: 8 }}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {`Đã hoàn thành ${completedContentCount}/${totalContentCount} bài`}
            </Text>
            <Text style={styles.progressPercent}>{`${progressPercent}%`}</Text>
          </View>
          <div
            role="progressbar"
            aria-label="Tiến độ khóa học"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            style={styles.progressTrack as React.CSSProperties}>
            <div
              style={{
                ...(styles.progressFill as React.CSSProperties),
                width: `${progressPercent}%`,
              }}
            />
          </div>
        </View>
      )}
      <AppButton
        type="primary"
        disabled={!hasContent}
        onClick={handleStartLesson}>
        {hasContent ? continueButtonLabel : 'Sẽ có trong tương lai'}
      </AppButton>
    </View>
  );

  const skillsCard = !!lessonDetail?.learnedSkills?.length && (
    <View style={styles.card}>
      <Text style={styles.cardSubTitle}>Bạn sẽ học được</Text>
      {lessonDetail.learnedSkills.map((item: string, idx: number) => (
        <View key={idx} style={styles.skillRow}>
          <CheckOutlined aria-hidden style={styles.skillIcon} />
          <Text style={styles.skillText}>{item.replace(/\n+/g, '\n')}</Text>
        </View>
      ))}
    </View>
  );

  const averageRating = ratingSummary?.averageRating ?? 0;
  const gridColumns = isMobile ? '1fr' : '1.7fr 1fr';

  if (isLoading) {
    return (
      <View style={styles.container}>
        <div
          style={{
            ...(styles.grid as React.CSSProperties),
            gridTemplateColumns: gridColumns,
          }}>
          <View style={styles.column}>
            <Skeleton.Image active style={{ width: '100%', height: 240 }} />
            <Skeleton active paragraph={{ rows: 4 }} />
          </View>
          <View style={styles.rail}>
            <Skeleton active paragraph={{ rows: 3 }} />
          </View>
        </div>
      </View>
    );
  }

  if (isError || !lessonDetail) {
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Không tải được khóa học.</Text>
          <AppButton
            style={{ width: 'auto', height: 40 }}
            onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        ...styles.container,
        ...(isMobile ? styles.containerMobile : {}),
      }}>
      {contextHolder}
      <div
        style={{
          ...(styles.grid as React.CSSProperties),
          gridTemplateColumns: gridColumns,
          ...(isTablet ? { gap: 20 } : {}),
        }}>
        <View style={styles.column}>
          <View style={styles.cover}>
            <LessonThumbnail thumbnail={lessonDetail.thumbnail} />
          </View>
          <View style={styles.headerBlock}>
            <Text style={isMobile ? styles.titleMobile : styles.title}>
              {lessonDetail.title.trim()}
            </Text>
            <Text style={styles.metaLine}>
              {`${lessonDetail.instructor ? `Giảng viên: ${lessonDetail.instructor} · ` : ''}${lessonDetail.totalLibraries} bài · ${convertDurationToTime(lessonDetail.totalDuration)} · Cập nhật ${dayjs(lessonDetail.updatedAt).format('DD/MM/YYYY')}`}
            </Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(n =>
                n <= Math.round(averageRating) ? (
                  <StarFilled key={n} aria-hidden style={styles.ratingStars} />
                ) : (
                  <StarOutlined
                    key={n}
                    aria-hidden
                    style={styles.ratingStars}
                  />
                ),
              )}
              <Text style={styles.ratingText}>
                {ratingSummary?.ratingCount
                  ? `${averageRating.toFixed(1)} (${ratingSummary.ratingCount} đánh giá)`
                  : 'Chưa có đánh giá'}
              </Text>
            </View>
            <Text style={styles.description}>{lessonDetail.description}</Text>
          </View>
          {isMobile && progressCard}
          {curriculum}
        </View>
        <View
          style={{
            ...styles.rail,
            ...(isMobile ? {} : styles.railSticky),
          }}>
          {!isMobile && progressCard}
          {skillsCard}
          <CourseRatingSection lessonId={lessonDetail._id} />
        </View>
      </div>

      <Modal
        title={selectedSubLessonTitle}
        open={watcherModalVisible}
        onCancel={() => setWatcherModalVisible(false)}
        footer={null}
        width={isMobile ? '95%' : isTablet ? 600 : 700}>
        <AppVideoWatchers
          subLessonId={selectedSubLessonId || ''}
          subLessonTitle={selectedSubLessonTitle}
          userId={userProfile?._id || ''}
          lessonId={lessonDetail._id}
          onClose={() => setWatcherModalVisible(false)}
        />
      </Modal>

      <AppModalSuccess
        isVisibleModalSuccess={isVisibleModalSuccess}
        setIsVisibleModalSuccess={setIsVisibleModalSuccess}
      />
    </View>
  );
};

export default LessonDetailPage;
