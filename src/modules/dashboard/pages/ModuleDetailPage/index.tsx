'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import styles from './styles';
import {
  CheckCircleFilled,
  FilePdfOutlined,
  FileTextOutlined,
  LeftOutlined,
  LockOutlined,
  PictureOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import { Button, Modal, Skeleton, Tabs } from 'antd';
import { convertDurationToTime } from '@utils/time';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { useResponsive } from '@/styles/responsive';
import LibraryDetailItem, {
  LibraryDetailItemHandle,
} from '~mdDashboard/components/LibraryDetailItem';
import PracticeTaskContent from '~mdDashboard/components/PracticeTaskContent';
import CommentSection from '@components/CommentSection';
import BookmarkButton from '@components/BookmarkButton';
import LessonNotesPanel from '~mdDashboard/components/LessonNotesPanel';
import { isTaskAccessible as checkTaskAccessible } from '~mdDashboard/utils/isTaskAccessible';
import { useSearchParams, useRouter } from 'next/navigation';

const ModuleDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lessonId = searchParams.get('lessonId') || '';
  const subLessonId = searchParams.get('subLessonId') || '';
  // Bài thực hành làm NGAY trong trang này (không điều hướng sang
  // /dashboard/practice/[id] nữa) — chọn bài nào thì đổi query param này,
  // y hệt cách subLessonId hoạt động cho video.
  const taskId = searchParams.get('taskId') || '';
  const {
    data: lessonDetail,
    isLoading: isLoadingData,
    isError: isLessonError,
    refetch: refetchLesson,
  } = dashboardQuery.useGetLessonIdQuery({
    id: lessonId,
  });
  // 1 khóa học có thể chứa cả bài học video và bài thực hành trong cùng 1
  // phần — lấy thêm danh sách bài thực hành đã publish của khóa này để
  // trộn vào đúng chỗ (theo order) khi hiện "Nội dung khóa học".
  const { data: practiceTasksForLesson, refetch: refetchPracticeTasks } =
    dashboardQuery.useGetPracticeTasksStudentQuery(
      { lessonId },
      { skip: !lessonId },
    );

  const { selectedLibrary } = useAppSelector(state => state.dashboardReducer);
  const dispatch = useAppDispatch();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  // Bài thực hành đứng NGAY SAU 1 video chỉ mở khóa được nếu biết chắc video
  // đó đã XEM XONG (không chỉ "đã tới lượt xem") — usersCanPlay không đủ vì
  // chỉ báo đã mở khóa, không phân biệt được với đã xem hết. Xem
  // isTaskAccessible bên dưới.
  const { data: videoCompletedBySubLesson, refetch: refetchVideoProgress } =
    dashboardQuery.useGetMyLessonVideoProgressQuery(
      { userId: userProfile?._id || '', lessonId },
      { skip: !userProfile?._id || !lessonId },
    );
  // Tương tự nhưng cho quiz — bài thực hành đứng ngay sau 1 quiz chỉ mở khóa
  // được nếu đã ĐẠT quiz đó (isPass), xem isTaskAccessible bên dưới.
  const { data: quizPassedByLibrary, refetch: refetchQuizProgress } =
    dashboardQuery.useGetMyLessonQuizProgressQuery(
      { userId: userProfile?._id || '', lessonId },
      { skip: !userProfile?._id || !lessonId },
    );
  // "Đã xem N phút" dưới tiêu đề bài học - lastPosition tính bằng giây, chỉ
  // gọi khi đang xem video thật (không phải quiz/bài thực hành).
  const { data: videoProgress } = dashboardQuery.useGetLessonProgressQuery(
    {
      userId: userProfile?._id || '',
      subLessonId: selectedLibrary?._id || '',
      lessonId,
    },
    {
      skip:
        !userProfile?._id ||
        !selectedLibrary?._id ||
        selectedLibrary?.type === 'Text',
    },
  );
  const libraryRef = useRef<LibraryDetailItemHandle>(null);
  // Danh sách id bài học đã "lưu" của user - để hiện đúng trạng thái nút
  // Bookmark ngay khi mở bài mà không phải gọi lẻ từng bài.
  const { data: bookmarkedSubIds } =
    dashboardQuery.useGetBookmarkIdsQuery('sublesson');
  const [setLibraryCanPlay] = dashboardQuery.useSetLibraryCanPlayMutation();
  const [submitResultTest] = dashboardQuery.useSubmitResultTestMutation();
  const [, contextHolder] = Modal.useModal();
  const { isMobile, isTablet } = useResponsive();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataQuestion, setDataQuestion] = useState<any[]>([]);
  const [resultData, setResultData] = useState({
    correctCount: 0,
    totalQuestions: 0,
    score: 0,
    isPass: false,
    feedback: '',
  });

  // Câu hỏi lấy trực tiếp từ selectedLibrary.questionList (đã có sẵn trong
  // dữ liệu bài học tải về) — không còn fetch riêng qua generate-questions
  // (endpoint đó trả nguyên JSON công khai trên GCS, có cả correctAnswer,
  // lộ đáp án qua Network tab). correctAnswer đã bị lược bỏ ở server trước
  // khi tới đây; chấm điểm thật diễn ra ở server khi submit.
  useEffect(() => {
    if (selectedLibrary?.type === 'Text') {
      // Vài câu hỏi cũ có thể thiếu _id — không có key ổn định thì chọn đáp
      // án cho 1 câu sẽ vô tình áp dụng cho mọi câu khác.
      const questionsWithId = (selectedLibrary.questionList || []).map(
        (question: any, index: number) => ({
          ...question,
          _id: question._id || `q-${index}`,
        }),
      );
      setDataQuestion(questionsWithId);
    }
  }, [selectedLibrary?._id, selectedLibrary?.questionList]);

  useEffect(() => {
    // Đang xem 1 bài thực hành (taskId trên URL) — không tự chọn video nào
    // cả, để nguyên cho nhánh render bài thực hành bên dưới xử lý.
    if (taskId) return;
    if (
      isLoadingData ||
      !lessonDetail?.modules ||
      lessonDetail.modules.length === 0
    )
      return;

    const allLibraries = lessonDetail.modules.flatMap(
      module => module.libraries || [],
    );
    if (allLibraries.length === 0) return;

    let targetLibrary = null;

    if (
      subLessonId &&
      subLessonId !== 'first-lesson' &&
      subLessonId !== 'undefined'
    ) {
      targetLibrary = allLibraries.find(lib => lib._id === subLessonId);
    }

    if (!targetLibrary) {
      targetLibrary = allLibraries[0];
    }

    if (targetLibrary && selectedLibrary?._id !== targetLibrary._id) {
      dispatch(dashboardAction.setSelectedLibrary(targetLibrary));
    }
  }, [
    lessonDetail,
    subLessonId,
    taskId,
    isLoadingData,
    selectedLibrary?._id,
    dispatch,
  ]);

  const handleSelectLibrary = (subItem: any) => {
    dispatch(dashboardAction.setSelectedLibrary(subItem));
    router.push(
      `/dashboard/home/lesson/moduleDetail?lessonId=${lessonId}&subLessonId=${subItem._id}`,
    );
  };

  const handleSelectTask = (task: any) => {
    router.push(
      `/dashboard/home/lesson/moduleDetail?lessonId=${lessonId}&taskId=${task._id}`,
    );
  };

  const isAdmin = userProfile?.role?.level <= 2;

  const hasAccess = (item: any) =>
    isAdmin || item?.usersCanPlay?.some(user => user._id === userProfile?._id);

  // Trộn bài học video (order = vị trí trong module.libraries[]) với bài
  // thực hành thuộc module này (order = field riêng) thành 1 danh sách nội
  // dung duy nhất, đúng thứ tự admin đã sắp xếp trong màn Phần học.
  const getModuleContentItems = (moduleItem: any) => {
    const libraryItems = (moduleItem.libraries || []).map(
      (l: any, i: number) => ({ kind: 'library' as const, data: l, order: i }),
    );
    const taskItems = (practiceTasksForLesson || [])
      .filter(t => t.moduleId === moduleItem._id)
      .map(t => ({ kind: 'task' as const, data: t, order: t.order ?? 0 }));
    return [...libraryItems, ...taskItems].sort((a, b) => a.order - b.order);
  };

  // Toàn bộ nội dung khóa học (video + bài thực hành) theo ĐÚNG 1 thứ tự
  // duy nhất, nối các module lại theo đúng thứ tự module — dùng để: (1) tìm
  // "nội dung tiếp theo" thật sự khi 1 video xem xong hoặc 1 bài thực hành
  // đạt >= 80%, dù nội dung kế tiếp là video hay bài thực hành; (2) khoá
  // các bài thực hành CHƯA tới lượt trong sidebar.
  const getLessonContentItems = () =>
    (lessonDetail?.modules || []).flatMap(m => getModuleContentItems(m));

  // Logic thật nằm ở utils/isTaskAccessible.ts (dùng chung với
  // LessonDetailPage, có test riêng) — wrapper này chỉ khép kín state của
  // trang lại thành đúng chữ ký (seq, idx) mà các chỗ gọi bên dưới đang dùng.
  const isTaskAccessible = (
    seq: { kind: 'library' | 'task'; data: any }[],
    idx: number,
  ) =>
    checkTaskAccessible(seq, idx, {
      isAdmin,
      videoCompletedBySubLesson,
      quizPassedByLibrary,
    });

  const isContentDone = (item: { kind: 'library' | 'task'; data: any }) => {
    if (item.kind === 'task') return !!item.data.hasPassed;
    if (item.data.type === 'Text') {
      return !!quizPassedByLibrary?.[item.data._id];
    }
    return !!videoCompletedBySubLesson?.[item.data._id];
  };

  // Danh sách phẳng theo từng phần: mỗi mục là 1 <button> thật (Tab/Enter
  // hoạt động), mục đang học tô nền vàng nhạt + nhãn "Đang học", mục đã xong
  // có dấu tích + nhãn — trạng thái không chỉ dựa vào màu.
  const renderCurriculum = () => {
    const lessonSeq = getLessonContentItems();
    return (lessonDetail?.modules || []).map(moduleItem => {
      const contentItems = getModuleContentItems(moduleItem);
      return (
        <View key={moduleItem._id}>
          <View style={styles.moduleHeader}>
            <Text style={styles.moduleTitle} numberOfLines={2}>
              {moduleItem.title}
            </Text>
            <Text style={styles.moduleCount}>{contentItems.length} bài</Text>
          </View>
          {contentItems.map(contentItem => {
            const isTask = contentItem.kind === 'task';
            const data = contentItem.data;
            const isSelected = isTask
              ? taskId === data._id
              : !taskId && selectedLibrary?._id === data._id;
            const isLocked = isTask
              ? !isTaskAccessible(
                  lessonSeq,
                  lessonSeq.findIndex(
                    it => it.kind === 'task' && it.data._id === data._id,
                  ),
                )
              : !hasAccess(data);
            const isDone = isContentDone(contentItem);
            const meta = isTask
              ? `Bài thực hành ${data.subject}`
              : data.type === 'Text'
                ? 'Trắc nghiệm'
                : convertDurationToTime(data.duration);
            const stateLabel = isSelected
              ? 'Đang học'
              : isDone
                ? isTask
                  ? 'Đạt'
                  : 'Đã xong'
                : isLocked
                  ? 'Chưa mở'
                  : '';
            const blocked = isLocked && !isSelected;
            return (
              <button
                key={`${contentItem.kind}-${data._id}`}
                type="button"
                disabled={blocked}
                aria-current={isSelected ? 'true' : undefined}
                onClick={() =>
                  isTask ? handleSelectTask(data) : handleSelectLibrary(data)
                }
                style={{
                  ...styles.lessonRow,
                  ...(isSelected ? styles.lessonRowActive : null),
                  ...(blocked ? styles.lessonRowLocked : null),
                }}>
                <span
                  aria-hidden="true"
                  style={{
                    ...styles.lessonIcon,
                    ...(isDone ? styles.lessonIconDone : null),
                  }}>
                  {isDone ? (
                    <CheckCircleFilled />
                  ) : blocked ? (
                    <LockOutlined />
                  ) : isTask || data.type === 'Text' ? (
                    <FileTextOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )}
                </span>
                <View style={styles.lessonText}>
                  <Text numberOfLines={2} style={styles.lessonTitle}>
                    {data.title}
                  </Text>
                  <Text style={styles.lessonMeta}>{meta}</Text>
                </View>
                {!!stateLabel && (
                  <Text
                    style={[
                      styles.lessonState,
                      isDone && styles.lessonStateDone,
                      isSelected && styles.lessonStateCurrent,
                    ]}>
                    {stateLabel}
                  </Text>
                )}
              </button>
            );
          })}
        </View>
      );
    });
  };

  // renderCurriculum() duyệt MỌI phần × MỌI mục để dựng lại danh sách — bọc
  // useMemo để không chạy lại ở mỗi lần render không liên quan tới nó (vd mở
  // modal kết quả trắc nghiệm, đổi dataQuestion...).
  const curriculum = useMemo(
    () => renderCurriculum(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      lessonDetail?.modules,
      practiceTasksForLesson,
      taskId,
      selectedLibrary?._id,
      videoCompletedBySubLesson,
      quizPassedByLibrary,
      isAdmin,
    ],
  );

  // Tìm mục kế tiếp trong TOÀN BỘ khóa học (video + bài thực hành trộn
  // chung 1 thứ tự) rồi mở khóa/chuyển sang đúng mục đó — dùng chung cho cả
  // 2 trường hợp "vừa xem xong 1 video/trắc nghiệm" và "vừa nộp bài thực
  // hành đạt >= 80%". Trước đây chỉ tìm trong danh sách video (bỏ qua bài
  // thực hành hoàn toàn) nên nếu mục kế tiếp là bài thực hành, video xong
  // sẽ không chuyển đi đâu cả (hoặc nhảy nhầm sang video sau đó, bỏ qua bài
  // thực hành xen giữa).
  const goToNextContentItem = async (
    currentKind: 'library' | 'task',
    currentId: string,
  ) => {
    const seq = getLessonContentItems();
    const currentIndex = seq.findIndex(
      it => it.kind === currentKind && it.data._id === currentId,
    );
    if (currentIndex === -1) return;
    const next = seq[currentIndex + 1];
    if (!next) return;

    if (next.kind === 'library') {
      await setLibraryCanPlay({
        libraryId: next.data._id,
        userId: userProfile?._id,
      });
      handleSelectLibrary(next.data);
    } else {
      handleSelectTask(next.data);
    }
  };

  // Nút "← Bài trước" / "Bài tiếp theo →" dưới tiêu đề - điều hướng thủ
  // công qua lại giữa các mục, khác goToNextContentItem (chỉ chạy khi VỪA
  // hoàn thành 1 mục) - ở đây không đánh dấu hoàn thành gì cả, chỉ đơn
  // thuần chuyển màn. Lùi về mục trước luôn được phép; tới mục sau chỉ khi
  // đã mở khóa (hasAccess) - không cho nhảy cóc qua nội dung chưa tới lượt.
  const goToRelativeContentItem = (delta: 1 | -1) => {
    const seq = getLessonContentItems();
    const currentId = taskId || selectedLibrary?._id;
    const currentKind: 'library' | 'task' = taskId ? 'task' : 'library';
    const currentIndex = seq.findIndex(
      it => it.kind === currentKind && it.data._id === currentId,
    );
    if (currentIndex === -1) return;
    const target = seq[currentIndex + delta];
    if (!target) return;
    if (delta > 0 && !isTaskAccessible(seq, currentIndex + delta)) return;

    if (target.kind === 'library') {
      handleSelectLibrary(target.data);
    } else {
      handleSelectTask(target.data);
    }
  };

  const onWatchFinish = async () => {
    if (!selectedLibrary) return;
    // Tải lại tiến độ xem/làm bài NGAY sau khi mục này báo đã xong — nếu
    // không, mục kế tiếp (nếu là bài thực hành) vẫn thấy cache cũ (chưa xem
    // xong/chưa đạt) và bị khóa nhầm dù thật ra vừa xong đây. Gọi chung cả 2
    // (video lẫn quiz) thay vì rẽ nhánh theo selectedLibrary.type — hàm này
    // đã dùng chung cho cả 2 luồng đóng modal quiz (handleClose) lẫn video
    // xem xong, gọi thừa 1 lần refetch không hại gì.
    await Promise.all([refetchVideoProgress(), refetchQuizProgress()]);
    await goToNextContentItem('library', selectedLibrary._id);
  };

  // Bài thực hành vừa nộp đạt >= 80% (PracticeTaskContent tự kiểm tra, chỉ
  // gọi callback này khi isPass) — tải lại danh sách bài thực hành để
  // hasPassed cập nhật (mở khóa các bài thực hành phụ thuộc phía sau), rồi
  // chuyển sang mục tiếp theo như bình thường.
  const handleTaskPassed = async () => {
    if (!taskId) return;
    await refetchPracticeTasks();
    await goToNextContentItem('task', taskId);
  };
  const handleClose = () => {
    setIsModalOpen(false);
    if (resultData.isPass) onWatchFinish();
  };

  const showModal = (
    correctCount: number,
    totalQuestions: number,
    score: number,
    isPass: boolean,
    feedback?: string,
  ) => {
    setResultData({
      correctCount,
      totalQuestions,
      score,
      isPass,
      feedback: feedback || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (selectedAnswers: Record<string, string>) => {
    const totalQuestions = dataQuestion.length;
    if (!totalQuestions || !selectedLibrary) return;

    // Chấm điểm ở server (correctAnswer không còn có mặt ở client để so
    // sánh nữa) — gửi lựa chọn thô, nhận lại điểm số đã được server tính.
    try {
      const res = await submitResultTest({
        userId: userProfile?._id,
        libraryId: selectedLibrary._id,
        name: selectedLibrary.title,
        userName: userProfile?.fullName,
        selectedAnswers,
      }).unwrap();
      showModal(
        res.correctCount,
        res.totalQuestions,
        res.score,
        res.isPass,
        res.feedback,
      );
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
    }
  };
  const handlePauseVideo = () => {
    libraryRef.current?.pauseAll();
  };

  if (isLoadingData && !selectedLibrary && !taskId) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View
          style={[
            styles.layoutRow,
            isMobile && { flexDirection: 'column', gap: 16 },
          ]}>
          <View style={[styles.mainColumn, styles.skeletonColumn]}>
            <Skeleton.Image
              active
              style={{ width: '100%', height: isMobile ? 200 : 400 }}
            />
            <Skeleton active paragraph={{ rows: 3 }} />
          </View>
          <View style={[styles.rail, isMobile && styles.railMobile]}>
            <View style={styles.railHeader}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!selectedLibrary && !taskId) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View style={styles.stateBox}>
          {isLessonError ? (
            <>
              <Text style={styles.errorText}>
                Không tải được nội dung khóa học.
              </Text>
              <Button type="primary" onClick={() => refetchLesson()}>
                Thử lại
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.emptyText}>
                Không tìm thấy bài học yêu cầu.
              </Text>
              {!!lessonId && (
                <Button
                  onClick={() =>
                    router.push(`/dashboard/home/lesson/${lessonId}`)
                  }>
                  Quay lại chi tiết khóa học
                </Button>
              )}
            </>
          )}
        </View>
      </View>
    );
  }

  const layoutRowStyle = [
    styles.layoutRow,
    isMobile && { flexDirection: 'column', gap: 16 },
    !isMobile && { height: 'calc(100vh - 120px)', overflow: 'hidden' },
  ] as any;

  const mainColumnStyle = [
    styles.mainColumn,
    { display: 'flex', gap: 24 },
    isMobile && { width: '100%' },
    !isMobile && {
      overflowY: 'auto',
      maxHeight: '100%',
      scrollbarWidth: 'none',
    },
  ] as any;

  const videoStickyStyle = [
    styles.videoSticky,
    isMobile && { position: 'relative', top: 0 },
  ] as any;

  const railStyle = [
    styles.rail,
    isMobile && styles.railMobile,
    !isMobile && { maxHeight: '100%' },
  ] as any;

  // Mobile: xếp tiêu đề và nút thao tác chồng lên nhau theo cột thay vì
  // cùng 1 hàng - title dài (vd "Word - Giới thiệu Tổng quan Bài thi MOS
  // 2019") kèm nút cạnh nhau trên màn hình hẹp sẽ bị bóp chật, khó đọc.
  const titleRowStyle = [
    styles.titleRow,
    isMobile && { flexDirection: 'column', alignItems: 'flex-start', gap: 8 },
  ] as any;

  // "Bài N/M" dưới tiêu đề - vị trí mục đang xem trong TOÀN BỘ nội dung
  // khóa (video + bài thực hành trộn theo đúng thứ tự), không chỉ trong 1
  // module - khớp với cách LessonDetailPage đếm tiến độ.
  const currentContentSeq = getLessonContentItems();
  const currentContentKind: 'library' | 'task' = taskId ? 'task' : 'library';
  const currentContentId = taskId || selectedLibrary?._id;
  const currentContentIndex = currentContentSeq.findIndex(
    it => it.kind === currentContentKind && it.data._id === currentContentId,
  );
  const totalContentCount = currentContentSeq.length;
  const doneContentCount = currentContentSeq.filter(isContentDone).length;
  const progressPercent = totalContentCount
    ? Math.round((doneContentCount / totalContentCount) * 100)
    : 0;
  const watchedMinutes = videoProgress
    ? Math.floor((videoProgress.lastPosition || 0) / 60)
    : 0;
  const durationMinutes = selectedLibrary?.duration
    ? Math.round(selectedLibrary.duration / 60)
    : 0;

  // Tab "Tài liệu" - các mục PDF/Image nằm CÙNG MODULE với video đang xem
  // (vd slide bài giảng đính kèm) - dữ liệu thật sẵn có trong
  // lessonDetail.modules, không phải khái niệm riêng cần API mới.
  const currentModule = lessonDetail?.modules?.find((m: any) =>
    (m.libraries || []).some((l: any) => l._id === selectedLibrary?._id),
  );
  const moduleDocuments = (currentModule?.libraries || []).filter(
    (l: any) =>
      l._id !== selectedLibrary?._id &&
      (l.type === 'PDF' || l.type === 'Image'),
  );

  // Nút quay lại trang tổng quan khóa học - đứng đầu cột nội dung (không
  // nằm trong videoStickyStyle) nên luôn là thứ đầu tiên nhìn thấy, kể cả
  // trước khi cuộn.
  const backToLessonBar = lessonId ? (
    <button
      type="button"
      style={styles.backBar}
      onClick={() => router.push(`/dashboard/home/lesson/${lessonId}`)}>
      <LeftOutlined style={styles.backBarIcon} />
      <Text style={styles.backBarText}>Quay lại chi tiết khóa học</Text>
    </button>
  ) : null;

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {contextHolder}
      <View style={layoutRowStyle}>
        <View style={mainColumnStyle}>
          {backToLessonBar}
          {taskId ? (
            <View style={videoStickyStyle}>
              <PracticeTaskContent
                taskId={taskId}
                onPassed={handleTaskPassed}
              />
            </View>
          ) : selectedLibrary?.type === 'Text' ? (
            <View style={videoStickyStyle}>
              <View style={styles.layoutTitleContainer}>
                <View style={titleRowStyle}>
                  <View style={styles.fullWidthFlex}>
                    <Text
                      style={[
                        styles.layoutTitle,
                        isMobile && styles.layoutTitleMobile,
                      ]}>
                      {selectedLibrary?.title}
                    </Text>
                  </View>
                  {!taskId && selectedLibrary && (
                    <View style={styles.titleRowActions}>
                      <BookmarkButton
                        itemType="sublesson"
                        itemId={selectedLibrary._id}
                        lessonId={lessonDetail?._id}
                        size={20}
                        bookmarked={(bookmarkedSubIds || []).includes(
                          selectedLibrary._id,
                        )}
                      />
                      <CommentSection
                        postId={selectedLibrary._id}
                        type={selectedLibrary.type}
                      />
                    </View>
                  )}
                </View>
              </View>
              <LibraryDetailItem
                ref={libraryRef}
                data={selectedLibrary}
                dataQuestion={dataQuestion}
                lessonId={lessonDetail?._id}
                onWatchFinish={onWatchFinish}
                onClickSubmit={handleSubmit}
              />
              <Tabs
                items={[
                  {
                    key: 'my-notes',
                    label: 'Ghi chú của tôi',
                    children: (
                      <LessonNotesPanel
                        subLessonId={selectedLibrary._id}
                        lessonId={lessonDetail?._id}
                        isVideo={false}
                      />
                    ),
                  },
                ]}
              />
            </View>
          ) : (
            <View style={videoStickyStyle}>
              <LibraryDetailItem
                ref={libraryRef}
                data={selectedLibrary}
                lessonId={lessonDetail?._id}
                onWatchFinish={onWatchFinish}
                answeredQuestionIds={
                  videoProgress?.correctlyAnsweredQuestionIds
                }
              />
              <View style={styles.layoutTitleContainer}>
                {currentContentIndex >= 0 && (
                  <Text style={styles.contentMetaText}>
                    Bài {currentContentIndex + 1}/{totalContentCount}
                    {!!durationMinutes && ` · ${durationMinutes} phút`}
                    {!!watchedMinutes && ` · đã xem ${watchedMinutes} phút`}
                  </Text>
                )}
                <View style={titleRowStyle}>
                  <View style={styles.fullWidthFlex}>
                    <Text style={styles.layoutTitle}>
                      {selectedLibrary?.title}
                    </Text>
                  </View>
                  {selectedLibrary && (
                    <View style={styles.titleRowActions}>
                      <BookmarkButton
                        itemType="sublesson"
                        itemId={selectedLibrary._id}
                        lessonId={lessonDetail?._id}
                        size={20}
                        bookmarked={(bookmarkedSubIds || []).includes(
                          selectedLibrary._id,
                        )}
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.description}>
                  {selectedLibrary?.description}
                </Text>
                {!taskId && selectedLibrary && (
                  <Tabs
                    items={[
                      {
                        key: 'note',
                        label: 'Ghi chú bài học',
                        children: selectedLibrary.note ? (
                          <View style={styles.noteCallout}>
                            <Text style={styles.noteBoxText}>
                              {selectedLibrary.note}
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.tabEmptyText}>
                            Bài học này chưa có ghi chú.
                          </Text>
                        ),
                      },
                      {
                        key: 'my-notes',
                        label: 'Ghi chú của tôi',
                        children: (
                          <LessonNotesPanel
                            subLessonId={selectedLibrary._id}
                            lessonId={lessonDetail?._id}
                            isVideo={['Youtube', 'Video', 'Short'].includes(
                              selectedLibrary.type,
                            )}
                            getCurrentTimeSec={() =>
                              libraryRef.current?.getCurrentTimeSec() ?? 0
                            }
                            onSeek={sec => libraryRef.current?.seekToSec(sec)}
                          />
                        ),
                      },
                      {
                        key: 'documents',
                        label: `Tài liệu${moduleDocuments.length ? ` (${moduleDocuments.length})` : ''}`,
                        children:
                          moduleDocuments.length > 0 ? (
                            <View style={styles.documentList}>
                              {moduleDocuments.map((doc: any) => (
                                <button
                                  key={doc._id}
                                  type="button"
                                  onClick={() => handleSelectLibrary(doc)}
                                  style={styles.documentRow}>
                                  {doc.type === 'PDF' ? (
                                    <FilePdfOutlined
                                      style={styles.documentIcon}
                                    />
                                  ) : (
                                    <PictureOutlined
                                      style={styles.documentIcon}
                                    />
                                  )}
                                  <Text
                                    style={styles.documentTitle}
                                    numberOfLines={1}>
                                    {doc.title}
                                  </Text>
                                  <Text style={styles.documentKind}>
                                    {doc.type === 'PDF' ? 'PDF' : 'Hình ảnh'}
                                  </Text>
                                </button>
                              ))}
                            </View>
                          ) : (
                            <Text style={styles.tabEmptyText}>
                              Bài học này chưa có tài liệu đính kèm.
                            </Text>
                          ),
                      },
                      {
                        key: 'discussion',
                        label: 'Thảo luận',
                        children: (
                          <CommentSection
                            postId={selectedLibrary._id}
                            type={selectedLibrary.type}
                            inline
                          />
                        ),
                      },
                    ]}
                  />
                )}
                {totalContentCount > 0 && (
                  <View style={styles.contentNavRow}>
                    <button
                      type="button"
                      disabled={currentContentIndex <= 0}
                      onClick={() => goToRelativeContentItem(-1)}
                      style={{
                        ...styles.navButton,
                        ...(currentContentIndex <= 0
                          ? styles.navButtonDisabled
                          : null),
                      }}>
                      <Text style={styles.navTextBack} numberOfLines={1}>
                        {currentContentIndex > 0
                          ? `← Bài ${currentContentIndex}: ${currentContentSeq[currentContentIndex - 1]?.data?.title || ''}`
                          : '← Bài trước'}
                      </Text>
                    </button>
                    <button
                      type="button"
                      disabled={
                        currentContentIndex < 0 ||
                        currentContentIndex >= totalContentCount - 1
                      }
                      onClick={() => goToRelativeContentItem(1)}
                      style={{
                        ...styles.navButton,
                        ...styles.navButtonForward,
                        ...(currentContentIndex < 0 ||
                        currentContentIndex >= totalContentCount - 1
                          ? styles.navButtonDisabled
                          : null),
                      }}>
                      <Text style={styles.navTextForward} numberOfLines={1}>
                        {currentContentIndex >= 0 &&
                        currentContentIndex < totalContentCount - 1
                          ? `Bài ${currentContentIndex + 2}: ${currentContentSeq[currentContentIndex + 1]?.data?.title || ''} →`
                          : 'Bài tiếp theo →'}
                      </Text>
                    </button>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {lessonDetail?.modules?.length > 0 && (
          <View style={railStyle}>
            <View style={styles.railHeader}>
              <Text style={styles.railTitle}>Nội dung khóa học</Text>
              <Text style={styles.railProgressLabel}>
                {doneContentCount}/{totalContentCount} bài đã hoàn thành ·{' '}
                {progressPercent}%
              </Text>
              <div
                role="progressbar"
                aria-label="Tiến độ khóa học"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
            </View>
            {isMobile ? (
              // Plain View on mobile — react-native-web's ScrollView still
              // attaches its own JS touch handling even with overflow
              // disabled via style, which fights the page's native scroll
              // and makes scrolling feel like it randomly stops working.
              <View>{curriculum}</View>
            ) : (
              <ScrollView style={styles.railScroll}>{curriculum}</ScrollView>
            )}
          </View>
        )}
      </View>
      <Modal
        title="Kết quả bài tập"
        open={isModalOpen}
        onCancel={handleClose}
        centered
        footer={null}
        width={520}>
        <div style={styles.modalContent}>
          <div style={styles.resultCard}>
            <div style={styles.row}>
              <span>Số câu trả lời đúng:</span>
              <strong>
                {resultData.correctCount}/{resultData.totalQuestions}
              </strong>
            </div>
            <div style={styles.row}>
              <span>Điểm số:</span>
              <strong
                style={
                  resultData.isPass ? styles.scoreSuccess : styles.scoreFail
                }>
                {resultData.score} / 10
              </strong>
            </div>
          </div>

          <div
            style={
              resultData.isPass ? styles.statusBoxSuccess : styles.statusBoxFail
            }>
            {resultData.isPass
              ? 'Chúc mừng! Bạn đã vượt qua bài tập này thành công.'
              : 'Bạn chưa vượt qua bài tập này. Vui lòng thử lại.'}
          </div>

          {resultData.feedback && (
            <div style={styles.aiFeedbackBox}>
              <strong>Nhận xét từ AI</strong>
              <p style={{ margin: '4px 0 0' }}>{resultData.feedback}</p>
            </div>
          )}

          <Button type="primary" block size="large" onClick={handleClose}>
            {resultData.isPass ? 'Tiếp tục bài học' : 'Làm lại bài tập'}
          </Button>

          <Button block size="large" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>
        </div>
      </Modal>
    </View>
  );
};

export default ModuleDetailPage;
