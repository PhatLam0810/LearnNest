import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import { CaretRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import LibraryDetailItem, {
  LibraryDetailItemHandle,
} from '../SubLessonDetailPage/_components/LibraryDetailItem';
import { Button, Collapse, CollapseProps, Modal } from 'antd';
import { convertDurationToTime } from '@utils';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { FaceDetection } from '~mdAuth/components';
import { useResponsive } from '@/styles/responsive';

const ModuleDetailPage = () => {
  const { selectedModule, lessonDetail, selectedLibrary } = useAppSelector(
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
        <View style={{ gap: 8, marginTop: 8 }}>
          {item.libraries.map((subItem, subIndex) => {
            return (
              <TouchableOpacity
                key={subIndex}
                style={[
                  !subItem?.usersCanPlay?.some(
                    id => id._id === userProfile?._id,
                  ) && styles.disabledButton,
                ]}>
                <View
                  onClick={() => {
                    if (
                      subItem?.usersCanPlay?.some(
                        id => id._id === userProfile?._id,
                      )
                    ) {
                      dispatch(dashboardAction.setSelectedLibrary(subItem));
                    }
                  }}
                  style={[
                    styles.buttonModule,
                    selectedLibrary?._id === subItem._id && {
                      backgroundColor: '#ef405c',
                      color: '#FFF',
                    },
                  ]}>
                  <PlayCircleOutlined />
                  <View style={{ paddingVertical: 7, flex: 1 }}>
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
    dispatch(dashboardAction.getLessonDetail({ id: lessonDetail._id }));
    dispatch(dashboardAction.setSelectedLibrary(nextLibrary));
  };
  const showModal = (correctCount, totalQuestions, score, isPass) => {
    modal.info({
      title: 'Result',
      content: (
        <div>
          <p>
            ✅ Correct answers: {correctCount}/{totalQuestions}
          </p>
          <p>
            🏆 Score: <strong>{score}</strong> / 10
          </p>
          {!isPass && (
            <p style={{ color: 'red' }}>
              ❌ You have failed the exam. Please try again.
            </p>
          )}
        </div>
      ),
      onOk: () => {
        if (isPass) {
          onWatchFinish(); // Call callback when passed
        }
      },
    });
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
      userName: userProfile?.firstName,
      isPass,
      totalQuestions: totalQuestions,
      correctCount: correctCount,
    });
    showModal(correctCount, totalQuestions, score, isPass);
  };

  const handlePauseVideo = () => {
    libraryRef.current?.pauseAll(); // 👈 Gọi pauseAll() bên trong LibraryDetailItem
  };

  if (!selectedLibrary) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No library selected</Text>
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
                <View style={{ width: '100%', flex: 1 }}>
                  <Text style={styles.layoutTitle}>
                    {selectedLibrary?.title}
                  </Text>
                </View>
              </View>
              <LibraryDetailItem
                ref={libraryRef}
                data={selectedLibrary}
                onWatchFinish={onWatchFinish}
                onClickSubmit={handleSubmit}
              />
            </View>
          ) : (
            <View style={videoStickyStyle}>
              <LibraryDetailItem
                ref={libraryRef}
                data={selectedLibrary}
                onWatchFinish={onWatchFinish}
              />
              <View style={styles.layoutTitleContainer}>
                <View style={{ width: '100%', flex: 1 }}>
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
              <FaceDetection onPauseVideo={handlePauseVideo} />
            </View>

            <ScrollView
              style={lessonScrollStyle}
              contentContainerStyle={lessonScrollContentStyle}>
              <View style={styles.lessonContentHeader}>
                <Text style={styles.lessonContentTitle}>Lesson Content</Text>
              </View>
              <View style={{ gap: 12 }}>
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
    </View>
  );
};

export default ModuleDetailPage;
