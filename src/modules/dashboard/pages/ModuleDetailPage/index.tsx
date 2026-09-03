'use client';

import React, { CSSProperties, useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native-web';
import styles from './styles';
import {
  CaretRightOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import { Button, Collapse, CollapseProps, Modal, Tag } from 'antd';
import { convertDurationToTime } from '@utils';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { useResponsive } from '@/styles/responsive';
import LibraryDetailItem, {
  LibraryDetailItemHandle,
} from '~mdDashboard/components/LibraryDetailItem';
import PracticeTaskContent from '~mdDashboard/components/PracticeTaskContent';
import CommentSection from '@components/CommentSection';
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
  const { data: lessonDetail, isLoading: isLoadingData } =
    dashboardQuery.useGetLessonIdQuery({
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
  const libraryRef = useRef<LibraryDetailItemHandle>(null);
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

  const getItems = (panelStyle: CSSProperties): CollapseProps['items'] => {
    const lessonSeq = getLessonContentItems();
    return (
      lessonDetail?.modules?.map((item, index) => {
        const contentItems = getModuleContentItems(item);
        return {
          key: index,
          label: (
            <div style={styles.moduleContentHeader}>
              <p style={styles.moduleTitleText} title={item.title}>
                {item.title}
              </p>
              <p style={styles.moduleCountText}>
                Tổng số bài học: {contentItems.length}
              </p>
            </div>
          ),
          children: (
            <View style={styles.contentGap8Margin8}>
              {contentItems.map((contentItem, subIndex) => {
                if (contentItem.kind === 'task') {
                  const task = contentItem.data;
                  const isTaskSelected = taskId === task._id;
                  const globalIdx = lessonSeq.findIndex(
                    it => it.kind === 'task' && it.data._id === task._id,
                  );
                  const isTaskDisabled = !isTaskAccessible(
                    lessonSeq,
                    globalIdx,
                  );
                  return (
                    <TouchableOpacity
                      key={task._id}
                      style={[
                        isTaskDisabled &&
                          !isTaskSelected &&
                          styles.disabledButton,
                      ]}>
                      <View
                        onClick={() => {
                          if (isTaskDisabled) return;
                          handleSelectTask(task);
                        }}
                        style={[
                          styles.buttonModule,
                          isTaskSelected && {
                            backgroundColor: 'var(--color-vhu-primary)',
                            color: '#FFF',
                          },
                        ]}>
                        <FileTextOutlined
                          style={isTaskSelected ? { color: '#FFF' } : undefined}
                        />
                        <View style={styles.libraryItemPadding}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.moduleItemTitle,
                              isTaskSelected && { color: '#FFF' },
                            ]}>
                            {task.title}
                          </Text>
                          <Tag
                            color={task.subject === 'Excel' ? 'green' : 'blue'}
                            style={{ marginTop: 2 }}>
                            Bài thực hành {task.subject}
                            {task.hasPassed ? ' · Đạt' : ''}
                          </Tag>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }

                const subItem = contentItem.data;
                const isDisabled = !hasAccess(subItem);
                const isSelected = selectedLibrary?._id === subItem._id;

                return (
                  <TouchableOpacity
                    key={subIndex}
                    style={[
                      isDisabled && !isSelected && styles.disabledButton,
                    ]}>
                    <View
                      onClick={() => {
                        if (isDisabled) return;
                        handleSelectLibrary(subItem);
                      }}
                      style={[
                        styles.buttonModule,
                        isSelected && {
                          backgroundColor: 'var(--color-vhu-primary)',
                          color: '#FFF',
                        },
                      ]}>
                      <PlayCircleOutlined />
                      <View style={styles.libraryItemPadding}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.moduleItemTitle,
                            isSelected && {
                              color: '#FFF',
                            },
                          ]}>
                          {subItem.title}
                        </Text>
                        <Text
                          style={[
                            styles.moduleItemTime,
                            isSelected && {
                              color: '#FFF',
                            },
                          ]}>
                          {subItem.type !== 'Text'
                            ? convertDurationToTime(subItem.duration)
                            : 'Trắc nghiệm'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ),
          style: panelStyle,
        };
      }) || []
    );
  };

  const panelStyle: React.CSSProperties = {
    marginBottom: 12,
    background: '#f5f5f5',
    borderRadius: '#f5f5f5',
    border: 'none',
  };

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
      await dispatch(dashboardAction.getLessonDetail({ id: lessonId }));
      handleSelectLibrary(next.data);
    } else {
      handleSelectTask(next.data);
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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          height: '80vh',
        }}>
        <ActivityIndicator size="large" color="var(--color-vhu-primary)" />
        <Text style={{ color: '#8c8c8c' }}>Đang tải nội dung khóa học...</Text>
      </View>
    );
  }

  if (!selectedLibrary && !taskId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#999' }}>
          Không tìm thấy dữ liệu bài học yêu cầu
        </Text>
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
    !isMobile && { overflowY: 'auto', maxHeight: '100%' },
  ] as any;

  const videoStickyStyle = [
    styles.videoSticky,
    isMobile && { position: 'relative', top: 0 },
  ] as any;

  const sideColumnStyle = [
    styles.sideColumn,
    isMobile && {
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      position: 'relative',
      top: 0,
      gap: 12,
    },
    !isMobile && { maxHeight: '100%', overflow: 'hidden' },
  ] as any;

  const lessonScrollStyle = [
    styles.lessonScroll,
    isMobile && { maxHeight: 'none', overflowY: 'visible', padding: 0 },
  ] as any;

  const lessonScrollContentStyle = [
    styles.lessonScrollContent,
    isMobile && { paddingBottom: 0 },
  ] as any;

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {contextHolder}
      <View style={layoutRowStyle}>
        <View style={mainColumnStyle}>
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
                <View style={styles.fullWidthFlex}>
                  <Text
                    style={[
                      styles.layoutTitle,
                      isMobile && styles.layoutTitleMobile,
                    ]}>
                    {selectedLibrary?.title}
                  </Text>
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
            </View>
          ) : (
            <View style={videoStickyStyle}>
              <LibraryDetailItem
                ref={libraryRef}
                data={selectedLibrary}
                lessonId={lessonDetail?._id}
                onWatchFinish={onWatchFinish}
              />
              <View style={styles.layoutTitleContainer}>
                <View style={styles.fullWidthFlex}>
                  <Text style={styles.layoutTitle}>
                    {selectedLibrary?.title}
                  </Text>
                  <Text style={styles.description}>
                    {selectedLibrary?.description}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {!taskId && selectedLibrary && (
            <CommentSection
              postId={selectedLibrary._id}
              type={selectedLibrary.type}
            />
          )}
        </View>

        {lessonDetail?.modules?.length > 0 && (
          <View style={sideColumnStyle}>
            <View style={styles.faceWrapper}>
              {/* <FaceDetection onPauseVideo={handlePauseVideo} /> */}
            </View>
            <View style={styles.lessonContentHeader}>
              <Text style={styles.lessonContentTitle}>Nội dụng bài học</Text>
            </View>
            {isMobile ? (
              // Plain View on mobile — react-native-web's ScrollView still
              // attaches its own JS touch handling even with overflow
              // disabled via style, which fights the page's native scroll
              // and makes scrolling feel like it randomly stops working.
              <View style={lessonScrollStyle}>
                <View style={styles.libraryGap}>
                  <Collapse
                    bordered={false}
                    defaultActiveKey={[0]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    items={getItems(panelStyle)}
                  />
                </View>
              </View>
            ) : (
              <ScrollView
                style={lessonScrollStyle}
                contentContainerStyle={lessonScrollContentStyle}>
                <View style={styles.libraryGap}>
                  <Collapse
                    bordered={false}
                    defaultActiveKey={[0]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    items={getItems(panelStyle)}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </View>
      <Modal
        title="Kết quả bài tập"
        open={isModalOpen}
        onCancel={handleClose}
        centered
        footer={null} // Tắt footer mặc định để custom nút bấm
        width={600}
        height={600}>
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
              <strong>🤖 Nhận xét từ AI:</strong>
              <p style={{ margin: '4px 0 0' }}>{resultData.feedback}</p>
            </div>
          )}

          {/* Custom Buttons */}
          <Button
            type="primary"
            block
            size="large"
            style={{ backgroundColor: '#002766', marginBottom: '8px' }}
            onClick={handleClose}>
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
