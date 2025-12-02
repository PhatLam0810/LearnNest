// ModuleDetailPage.tsx (phần cập nhật)
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native-web';
import styles from './styles';
import { CaretRightOutlined, PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import LibraryDetailItem, {
  LibraryDetailItemHandle,
} from '../SubLessonDetailPage/_components/LibraryDetailItem';
import { AppHeader } from '@components';
import { Button, Collapse, CollapseProps, Modal } from 'antd';
import { convertDurationToTime } from '@utils';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { FaceDetection } from '~mdAuth/components';
import ViewersListModal from '~mdDashboard/components/ViewersListModal';

const ModuleDetailPage = () => {
  const { selectedModule, lessonDetail, selectedLibrary } = useAppSelector(
    state => state.dashboardReducer,
  );
  const dispatch = useAppDispatch();
  const libraryRef = useRef<LibraryDetailItemHandle>(null);
  const [setLibraryCanPlay] = dashboardQuery.useSetLibraryCanPlayMutation();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const [modal, contextHolder] = Modal.useModal();

  // Thêm state cho modal viewers
  const [showViewersModal, setShowViewersModal] = useState(false);

  const getItems = (panelStyle: CSSProperties): CollapseProps['items'] =>
    lessonDetail?.modules?.map((item, index) => ({
      key: index,
      label: (
        <View style={styles.moduleContentHeader}>
          <Text style={styles.learnedSkillText}>{item.title}</Text>
          <Text style={styles.learnedSkillText}>
            Total Libraries: {item.libraries.length}
          </Text>
        </View>
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
        <View>
          <Text>
            ✅ Correct answers: {correctCount}/{totalQuestions}
          </Text>
          <Text>
            🏆 Score: <Text>{score}</Text> / 10
          </Text>
          {!isPass && (
            <Text style={{ color: 'red' }}>
              ❌ You have failed the exam. Please try again.
            </Text>
          )}
        </View>
      ),
      onOk: () => {
        if (isPass) {
          onWatchFinish();
        }
      },
    });
  };

  const handleSubmit = (selectedAnswers: any) => {
    const totalQuestions = selectedLibrary.questionList.length;
    let correctCount = 0;

    selectedLibrary.questionList.forEach(question => {
      const userAnswer = selectedAnswers[question._id];
      const correctAnswer = question.correctAnswer;

      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    const score = ((correctCount / totalQuestions) * 10).toFixed(2);
    const isPass = correctCount >= (2 / 3) * totalQuestions;

    showModal(correctCount, totalQuestions, score, isPass);
  };

  const handlePauseVideo = () => {
    // libraryRef.current?.pauseAll();
  };

  return (
    <View style={styles.container}>
      {contextHolder}
      <AppHeader title={selectedModule?.title} subTitle={lessonDetail?.title} />

      {/* Thêm nút View Viewers */}
      {selectedLibrary && (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => setShowViewersModal(true)}
          style={{ marginBottom: 16, marginLeft: 16 }}
        >
          Xem người đã xem video
        </Button>
      )}

      <View style={{ flexDirection: 'row', gap: 24 }}>
        <ScrollView
          style={{ width: '70%' }}
          contentContainerStyle={{ paddingBottom: 100 }}>
          {selectedLibrary?.type === 'Text' ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </ScrollView>
        <ScrollView
          style={{ height: 1000, scrollbarWidth: 'none' }}
          contentContainerStyle={{ paddingBottom: 100 }}>
          {lessonDetail?.modules?.length > 0 && (
            <View style={{ gap: 24 }}>
              <FaceDetection onPauseVideo={handlePauseVideo} />

              <ScrollView contentContainerStyle={{ aspectRatio: 16 / 19 }}>
                <Text style={styles.lessonContentTitle}>Lesson Content</Text>
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
        </ScrollView>
      </View>

      {/* Modal hiển thị danh sách người xem */}
      <ViewersListModal
        lessonId={lessonDetail?._id || ''}
        visible={showViewersModal}
        onClose={() => setShowViewersModal(false)}
        videoTitle={selectedLibrary?.title}
      />
    </View>
  );
};

export default ModuleDetailPage;