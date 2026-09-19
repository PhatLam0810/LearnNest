'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import {
  FilePdfOutlined,
  LeftOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import { Button, Skeleton, Tabs } from 'antd';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { useResponsive } from '@/styles/responsive';
import LibraryDetailItem, {
  LibraryDetailItemHandle,
} from '~mdDashboard/components/LibraryDetailItem';
import PracticeTaskContent from '~mdDashboard/components/PracticeTaskContent';
import CurriculumRail, {
  CurriculumRailSkeleton,
} from '~mdDashboard/components/CurriculumRail';
import { messageApi } from '@hooks';
import CommentSection from '@components/CommentSection';
import BookmarkButton from '@components/BookmarkButton';
import LessonNotesPanel from '~mdDashboard/components/LessonNotesPanel';
import { isTaskAccessible as checkTaskAccessible } from '~mdDashboard/utils/isTaskAccessible';
import { getLessonContentItems } from '~mdDashboard/utils/getLessonContentItems';
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
  const { isMobile, isTablet } = useResponsive();
  const [dataQuestion, setDataQuestion] = useState<any[]>([]);
  // Số bình luận của bài đang xem cho nhãn tab "Thảo luận (n)" - do
  // CommentSection (mount sẵn trong tab) báo lên.
  const [commentCount, setCommentCount] = useState(0);

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

  // Toàn bộ nội dung khóa học (video + bài thực hành) theo ĐÚNG 1 thứ tự
  // duy nhất, nối các module lại theo đúng thứ tự module — dùng để: (1) tìm
  // "nội dung tiếp theo" thật sự khi 1 video xem xong hoặc 1 bài thực hành
  // đạt >= 80%, dù nội dung kế tiếp là video hay bài thực hành; (2) khoá
  // các bài thực hành CHƯA tới lượt.
  const getLessonSeq = () =>
    getLessonContentItems(lessonDetail?.modules, practiceTasksForLesson);

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
    const seq = getLessonSeq();
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
    const seq = getLessonSeq();
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
  // Quay về từ màn kết quả quiz (/dashboard/quiz-result/[resultId]) với
  // quizDone=1 nghĩa là vừa ĐẠT quiz -> chạy đúng luồng "xem xong" như trước
  // đây khi đóng modal kết quả (mở khóa + chuyển nội dung kế tiếp), một lần
  // duy nhất rồi bỏ param khỏi URL để tải lại trang không chạy lại.
  const quizDone = searchParams.get('quizDone') === '1';
  const quizDoneHandledRef = useRef(false);
  useEffect(() => {
    // Chưa có tiến độ quiz thì chờ (không chạy, không bỏ param) — tránh ai đó
    // tự gõ quizDone=1 để mở khóa mục kế tiếp mà chưa đạt quiz.
    if (
      !quizDone ||
      quizDoneHandledRef.current ||
      isLoadingData ||
      !lessonDetail?.modules ||
      !quizPassedByLibrary ||
      selectedLibrary?._id !== subLessonId
    )
      return;
    quizDoneHandledRef.current = true;
    router.replace(
      `/dashboard/home/lesson/moduleDetail?lessonId=${lessonId}&subLessonId=${subLessonId}`,
    );
    // Cache tiến độ có thể cũ (bài vừa nộp không invalidate) nên tải lại rồi
    // mới kiểm; chưa đạt thì chỉ bỏ param, không mở khóa.
    refetchQuizProgress().then(res => {
      if (res.data?.[subLessonId]) onWatchFinish();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    quizDone,
    isLoadingData,
    lessonDetail,
    quizPassedByLibrary,
    selectedLibrary?._id,
    subLessonId,
  ]);

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
      router.push(
        `/dashboard/quiz-result/${res._id}?lessonId=${lessonId}&subLessonId=${selectedLibrary._id}`,
      );
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
      messageApi.error('Nộp bài thất bại, vui lòng thử lại');
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
          <CurriculumRailSkeleton />
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
  const currentContentSeq = getLessonSeq();
  const currentContentKind: 'library' | 'task' = taskId ? 'task' : 'library';
  const currentContentId = taskId || selectedLibrary?._id;
  const currentContentIndex = currentContentSeq.findIndex(
    it => it.kind === currentContentKind && it.data._id === currentContentId,
  );
  const totalContentCount = currentContentSeq.length;
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
                        key: 'documents',
                        label: `Tài liệu (${moduleDocuments.length})`,
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
                        label: `Thảo luận (${commentCount})`,
                        // Mount sẵn để CommentSection kịp báo số bình luận
                        // cho nhãn tab kể cả khi chưa mở tab.
                        forceRender: true,
                        children: (
                          <CommentSection
                            key={selectedLibrary._id}
                            postId={selectedLibrary._id}
                            type={selectedLibrary.type}
                            inline
                            onCountChange={setCommentCount}
                          />
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
          <CurriculumRail
            modules={lessonDetail.modules}
            tasks={practiceTasksForLesson}
            videoCompletedBySubLesson={videoCompletedBySubLesson}
            quizPassedByLibrary={quizPassedByLibrary}
            isAdmin={isAdmin}
            currentUserId={userProfile?._id}
            selected={
              taskId
                ? { kind: 'task', id: taskId }
                : { kind: 'library', id: selectedLibrary?._id || '' }
            }
            onSelect={entry =>
              entry.kind === 'task'
                ? handleSelectTask(entry.data)
                : handleSelectLibrary(entry.data)
            }
          />
        )}
      </View>
    </View>
  );
};

export default ModuleDetailPage;
