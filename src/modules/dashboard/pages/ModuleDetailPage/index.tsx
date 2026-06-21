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
import { CaretRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import { Button, Collapse, CollapseProps, Modal } from 'antd';
import { convertDurationToTime } from '@utils';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { FaceDetection } from '~mdAuth/components';
import { useResponsive } from '@/styles/responsive';
import LibraryDetailItem, {
  LibraryDetailItemHandle,
} from '~mdDashboard/components/LibraryDetailItem';
import { useSearchParams, useRouter } from 'next/navigation';

const ModuleDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lessonId = searchParams.get('lessonId') || '';
  const subLessonId = searchParams.get('subLessonId') || '';

  const { lessonDetail, selectedLibrary } = useAppSelector(
    state => state.dashboardReducer,
  );
  const dispatch = useAppDispatch();
  const libraryRef = useRef<LibraryDetailItemHandle>(null);
  const [setLibraryCanPlay] = dashboardQuery.useSetLibraryCanPlayMutation();
  const [submitResultTest] = dashboardQuery.useSubmitResultTestMutation();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [modal, contextHolder] = Modal.useModal();
  const { isMobile, isTablet } = useResponsive();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultData, setResultData] = useState({
    correctCount: 0,
    totalQuestions: 0,
    score: 0,
    isPass: false,
  });

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    if (!lessonId) return;

    const loadCourseData = async () => {
      try {
        setIsLoadingData(true);
        await dispatch(dashboardAction.getLessonDetail({ id: lessonId }));
      } catch (error) {
        console.error('Lỗi khi đồng bộ chi tiết khóa học từ URL:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadCourseData();
  }, [lessonId, dispatch]);

  useEffect(() => {
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

  const isAdmin = userProfile?.role?.level <= 2;

  const hasAccess = item => {
    return (
      isAdmin || item?.usersCanPlay?.some(user => user._id === userProfile?._id)
    );
  };
  const getItems = (panelStyle: CSSProperties): CollapseProps['items'] =>
    lessonDetail?.modules?.map((item, index) => ({
      key: index,
      label: (
        <div style={styles.moduleContentHeader}>
          <p style={styles.learnedSkillText}>{item.title}</p>
          <p style={styles.learnedSkillText}>
            Total Libraries: {item.libraries.length}
          </p>
        </div>
      ),
      children: (
        <View style={styles.contentGap8Margin8}>
          {item.libraries.map((subItem, subIndex) => {
            return (
              <TouchableOpacity
                key={subIndex}
                style={[!hasAccess(subItem) && styles.disabledButton]}>
                <View
                  onClick={() => {
                    if (!hasAccess(subItem)) return;
                    handleSelectLibrary(subItem);
                  }}
                  style={[
                    styles.buttonModule,
                    selectedLibrary?._id === subItem._id && {
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
                        selectedLibrary?._id === subItem._id && {
                          color: '#FFF',
                        },
                      ]}>
                      {subItem.title}
                    </Text>
                    <Text
                      style={[
                        styles.moduleItemTime,
                        selectedLibrary?._id === subItem._id && {
                          color: '#FFF',
                        },
                      ]}>
                      {convertDurationToTime(subItem.duration)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ),
      style: panelStyle,
    })) || [];

  const panelStyle: React.CSSProperties = {
    marginBottom: 12,
    background: '#f5f5f5',
    borderRadius: '#f5f5f5',
    border: 'none',
  };

  const onWatchFinish = async () => {
    if (!selectedLibrary || !lessonDetail?.modules) return;

    const libraries = lessonDetail?.modules?.flatMap(
      module => module.libraries,
    );

    const currentIndex = libraries.findIndex(
      lib => lib._id === selectedLibrary?._id,
    );

    const nextLibrary = libraries[currentIndex + 1] || null;

    await setLibraryCanPlay({
      libraryId: nextLibrary?._id,
      userId: userProfile?._id,
    });

    await dispatch(dashboardAction.getLessonDetail({ id: lessonDetail._id }));

    if (nextLibrary) {
      handleSelectLibrary(nextLibrary);
    }
  };
  const handleClose = () => {
    setIsModalOpen(false);
    if (resultData.isPass) onWatchFinish();
  };
  const showModal = (correctCount, totalQuestions, score, isPass) => {
    setResultData({ correctCount, totalQuestions, score, isPass });
    setIsModalOpen(true);
  };

  const handleSubmit = (selectedAnswers: any) => {
    const totalQuestions = selectedLibrary?.questionList?.length || 0;
    if (!totalQuestions) return;
    let correctCount = 0;

    selectedLibrary?.questionList?.forEach(question => {
      const userAnswer = selectedAnswers[question._id]; // từ object người dùng chọn
      const correctAnswer = question.correctAnswer; // từ dữ liệu câu hỏi

      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    const score = ((correctCount / totalQuestions) * 10).toFixed(2); // giữ 2 số lẻ

    // Hiển thị kết quả trong modal
    const isPass = correctCount >= (2 / 3) * totalQuestions;

    submitResultTest({
      userId: userProfile?._id,
      libraryId: selectedLibrary._id,
      score: Number(score),
      name: selectedLibrary.title,
      userName: userProfile?.fullName,
      isPass,
      totalQuestions: totalQuestions,
      correctCount: correctCount,
    });
    showModal(correctCount, totalQuestions, score, isPass);
  };
  const handlePauseVideo = () => {
    // libraryRef.current?.pauseAll(); // 👈 Gọi pauseAll() bên trong LibraryDetailItem
  };

  // Màn hình chờ bọc lót trong quá trình hoán đổi dữ liệu API giữa các khóa học
  if (isLoadingData && !selectedLibrary) {
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

  // Nếu đã load xong mà rỗng thật sự, hiển thị thông báo an toàn thay vì block trắng menu
  if (!selectedLibrary) {
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
    <View style={styles.container}>
      {contextHolder}
      <View style={layoutRowStyle}>
        <View style={mainColumnStyle}>
          {selectedLibrary?.type === 'Text' ? (
            <View style={videoStickyStyle}>
              <View style={styles.layoutTitleContainer}>
                <View style={styles.fullWidthFlex}>
                  <Text style={styles.layoutTitle}>
                    {selectedLibrary?.title}
                  </Text>
                </View>
              </View>
              <LibraryDetailItem
                ref={libraryRef}
                data={selectedLibrary}
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
        </View>

        {lessonDetail?.modules?.length > 0 && (
          <View style={sideColumnStyle}>
            <View style={styles.faceWrapper}>
              {/* <FaceDetection onPauseVideo={handlePauseVideo} /> */}
            </View>
            <View style={styles.lessonContentHeader}>
              <Text style={styles.lessonContentTitle}>Nội dụng bài học</Text>
            </View>
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
          </View>
        )}
      </View>
      <Modal
        title="Kết quả bài thi"
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
              ? 'Chúc mừng! Bạn đã vượt qua bài thi này thành công.'
              : 'Bạn chưa vượt qua bài thi này. Vui lòng thử lại.'}
          </div>

          {/* Custom Buttons */}
          <Button
            type="primary"
            block
            size="large"
            style={{ backgroundColor: '#002766', marginBottom: '8px' }}
            onClick={handleClose}>
            {resultData.isPass ? 'Tiếp tục bài học' : 'Làm lại bài thi'}
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
