// ModuleDetailPage.tsx (đã xóa phần dư thừa)
import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native-web';
import {
  Button,
  Collapse,
  CollapseProps,
  Modal,
  Spin,
  message,
  Tabs,
} from 'antd';
import {
  CaretRightOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@redux';
import LibraryDetailItem, {
  LibraryDetailItemHandle,
} from '../SubLessonDetailPage/_components/LibraryDetailItem';
import { AppHeader } from '@components';
import { convertDurationToTime } from '@utils';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { FaceDetection } from '~mdAuth/components';
import axios from 'axios';
import styles from './styles';

interface TrackingItem {
  _id: string;
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  watchedAt: string;
  duration: number;
  progress: number;
  completed: boolean;
  subLessonId: string;
  watchedSeconds?: number;
  actualWatchedTime?: number;
  lastPosition?: number;
  totalWatchedTime?: number;
}

interface PaginationData {
  items: TrackingItem[];
  totalRecords: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data: PaginationData;
}

interface VideoTrackingState {
  isTracking: boolean;
  lastTrackTime: number;
  progress: number;
  currentTime: number;
  duration: number;
  totalWatchedTime: number;
}

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

  const [videoTrackingState, setVideoTrackingState] =
    useState<VideoTrackingState>({
      isTracking: false,
      lastTrackTime: 0,
      progress: 0,
      currentTime: 0,
      duration: 0,
      totalWatchedTime: 0,
    });

  const [trackingData, setTrackingData] = useState<PaginationData | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const userId = userProfile?._id || '';

  const [trackingInterval, setTrackingInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [initialTrackTimeout, setInitialTrackTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const formatSecondsToTime = useCallback((seconds: number): string => {
    if (!seconds || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getActualWatchedTime = useCallback((item: TrackingItem): number => {
    return (
      item.totalWatchedTime ||
      item.watchedSeconds ||
      item.actualWatchedTime ||
      item.lastPosition ||
      0
    );
  }, []);

  const fetchTrackingData = useCallback(
    async (subLessonId: string, forceRefresh = false) => {
      if (!subLessonId) return;

      const now = Date.now();
      if (!forceRefresh && now - lastUpdateTime < 2000) {
        return;
      }

      setLoadingTracking(true);
      try {
        const response = await axios.get<ApiResponse>(
          `${API_BASE_URL}/lesson/sublesson/${subLessonId}/watchers`,
          {
            params: {
              pageNum: 1,
              pageSize: 100,
              _t: now,
            },
          },
        );

        if (response.data.success && response.data.data?.items) {
          const rawItems = response.data.data.items;

          const userMap = new Map<string, TrackingItem>();

          rawItems.forEach(item => {
            const existing = userMap.get(item.userId);
            const currentWatchedTime = getActualWatchedTime(item);
            const existingWatchedTime = getActualWatchedTime(existing || item);

            if (!existing || currentWatchedTime > existingWatchedTime) {
              userMap.set(item.userId, {
                ...item,
                watchedSeconds: currentWatchedTime,
              });
            }
          });

          const uniqueItems = Array.from(userMap.values())
            .sort((a, b) => getActualWatchedTime(b) - getActualWatchedTime(a))
            .slice(0, 20);

          setTrackingData({
            ...response.data.data,
            items: uniqueItems,
            totalRecords: uniqueItems.length,
          });
          setLastUpdateTime(now);
        }
      } catch (error: any) {
        // Silently fail cho tracking data
      } finally {
        setLoadingTracking(false);
        setIsRefreshing(false);
      }
    },
    [API_BASE_URL, lastUpdateTime, getActualWatchedTime],
  );

  const refreshTrackingData = useCallback(async () => {
    if (selectedLibrary?._id) {
      setIsRefreshing(true);
      await fetchTrackingData(selectedLibrary._id, true);
      message.success('Đã cập nhật dữ liệu tracking');
    }
  }, [selectedLibrary?._id, fetchTrackingData]);

  const trackVideo = useCallback(
    async (data: {
      progress: number;
      currentTime?: number;
      duration?: number;
      completed?: boolean;
    }) => {
      if (!userId || !selectedLibrary?._id) return;

      const now = Date.now();

      const isInitialTrack = videoTrackingState.lastTrackTime === 0;

      if (!isInitialTrack && now - videoTrackingState.lastTrackTime < 10000) {
        return;
      }

      try {
        const actualDuration = selectedLibrary.duration || data.duration || 0;
        const currentPosition = Math.floor(data.currentTime || 0);

        const payload = {
          userId: userId,
          subLessonId: selectedLibrary._id,
          progress: Math.min(100, Math.max(0, data.progress || 0)),
          duration: Math.floor(actualDuration),
          completed: data.progress >= 95,
          watchedSeconds: currentPosition,
          currentTime: currentPosition,
          lastPosition: currentPosition,
        };

        await axios.post(`${API_BASE_URL}/lesson/video/track`, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 3000,
        });

        setVideoTrackingState(prev => ({
          ...prev,
          lastTrackTime: now,
          currentTime: currentPosition,
          progress: data.progress,
          duration: actualDuration,
        }));
      } catch (error: any) {
        // Silently fail
      }
    },
    [userId, selectedLibrary, videoTrackingState.lastTrackTime, API_BASE_URL],
  );

  const handleLibrarySelect = useCallback(
    async (library: any) => {
      setVideoTrackingState({
        isTracking: false,
        lastTrackTime: 0,
        progress: 0,
        currentTime: 0,
        duration: library.duration || 0,
        totalWatchedTime: 0,
      });

      if (trackingInterval) {
        clearInterval(trackingInterval);
        setTrackingInterval(null);
      }

      if (initialTrackTimeout) {
        clearTimeout(initialTrackTimeout);
        setInitialTrackTimeout(null);
      }

      dispatch(dashboardAction.setSelectedLibrary(library));

      if (library._id) {
        fetchTrackingData(library._id, true);
      }
    },
    [dispatch, fetchTrackingData, trackingInterval, initialTrackTimeout],
  );

  const handleVideoStart = useCallback(
    (duration?: number) => {
      if (duration && duration > 0) {
        const timeout = setTimeout(() => {
          if (videoTrackingState.currentTime > 0) {
            const progress = Math.round(
              (videoTrackingState.currentTime / duration) * 100,
            );
            trackVideo({
              progress: progress,
              currentTime: videoTrackingState.currentTime,
              duration: duration,
              completed: false,
            });
          }
        }, 1000);

        setInitialTrackTimeout(timeout as any);

        setVideoTrackingState(prev => ({
          ...prev,
          isTracking: true,
          duration: duration,
        }));

        // Setup interval tracking mỗi 10 giây
        if (!trackingInterval) {
          const interval = setInterval(() => {
            if (videoTrackingState.currentTime > 0) {
              const progress = Math.round(
                (videoTrackingState.currentTime / videoTrackingState.duration) *
                  100,
              );
              trackVideo({
                progress: progress,
                currentTime: videoTrackingState.currentTime,
                duration: videoTrackingState.duration,
                completed: progress >= 95,
              });
            }
          }, 10000);

          setTrackingInterval(interval);
        }
      }
    },
    [trackVideo, trackingInterval, videoTrackingState],
  );

  const handleVideoProgress = useCallback(
    (progress: number, currentTime: number, duration: number) => {
      setVideoTrackingState(prev => ({
        ...prev,
        progress,
        currentTime,
        duration,
        isTracking: progress < 95,
      }));
    },
    [],
  );

  const handleVideoPause = useCallback(
    (currentTime: number, duration: number) => {
      if (currentTime > 0 && duration > 0) {
        const progress = Math.round(
          (currentTime / Math.max(1, duration)) * 100,
        );

        trackVideo({
          progress: progress,
          currentTime: currentTime,
          duration: duration,
          completed: progress >= 95,
        });
      }
    },
    [trackVideo],
  );

  const handleVideoSeek = useCallback(
    (currentTime: number, duration: number) => {
      if (currentTime > 0 && duration > 0) {
        const progress = Math.round(
          (currentTime / Math.max(1, duration)) * 100,
        );

        trackVideo({
          progress: progress,
          currentTime: currentTime,
          duration: duration,
          completed: progress >= 95,
        });
      }
    },
    [trackVideo],
  );

  const handleVideoComplete = useCallback(() => {
    if (selectedLibrary?.duration) {
      setVideoTrackingState(prev => ({
        ...prev,
        progress: 100,
        currentTime: selectedLibrary.duration,
        isTracking: false,
      }));

      trackVideo({
        progress: 100,
        currentTime: selectedLibrary.duration,
        duration: selectedLibrary.duration,
        completed: true,
      });
    }
  }, [selectedLibrary?.duration, trackVideo]);

  useEffect(() => {
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
      if (initialTrackTimeout) {
        clearTimeout(initialTrackTimeout);
      }
    };
  }, [trackingInterval, initialTrackTimeout]);

  useEffect(() => {
    if (
      selectedLibrary?._id &&
      userId &&
      videoTrackingState.lastTrackTime === 0
    ) {
      const initialTrack = setTimeout(() => {
        trackVideo({
          progress: 0,
          currentTime: 0,
          duration: selectedLibrary.duration || 0,
          completed: false,
        });
      }, 1000);

      return () => {
        clearTimeout(initialTrack);
      };
    }
  }, [
    selectedLibrary?._id,
    userId,
    videoTrackingState.lastTrackTime,
    trackVideo,
  ]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        videoTrackingState.currentTime > 0 &&
        videoTrackingState.duration > 0
      ) {
        const progress = Math.round(
          (videoTrackingState.currentTime / videoTrackingState.duration) * 100,
        );

        const data = JSON.stringify({
          userId: userId,
          subLessonId: selectedLibrary?._id,
          progress: progress,
          currentTime: videoTrackingState.currentTime,
          duration: videoTrackingState.duration,
          completed: progress >= 95,
        });

        navigator.sendBeacon(`${API_BASE_URL}/lesson/video/track`, data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [videoTrackingState, userId, selectedLibrary?._id, API_BASE_URL]);

  const getItems = useCallback(
    (panelStyle: CSSProperties): CollapseProps['items'] => {
      return (
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
              {item.libraries.map(subItem => {
                const isDisabled = !subItem?.usersCanPlay?.some(
                  id => id._id === userId,
                );
                const isSelected = selectedLibrary?._id === subItem._id;

                return (
                  <View
                    key={subItem._id}
                    onClick={async () => {
                      if (!isDisabled) {
                        await handleLibrarySelect(subItem);
                      }
                    }}
                    style={[
                      isDisabled && styles.disabledButton,
                      {
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                      } as any,
                    ]}>
                    <View
                      style={[
                        styles.buttonModule,
                        isSelected && {
                          backgroundColor: '#ef405c',
                          color: '#FFF',
                        },
                        isDisabled && { opacity: 0.5 },
                      ]}>
                      <PlayCircleOutlined />
                      <View style={{ paddingVertical: 7, flex: 1 }}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.moduleItemTitle,
                            isSelected && { color: '#FFF' },
                            isDisabled && { color: '#999' },
                          ]}>
                          {subItem.title}
                        </Text>
                        <Text
                          style={[
                            styles.moduleItemTime,
                            isSelected && { color: '#FFF' },
                            isDisabled && { color: '#999' },
                          ]}>
                          {convertDurationToTime(subItem.duration)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ),
          style: panelStyle,
        })) || []
      );
    },
    [
      lessonDetail?.modules,
      userId,
      selectedLibrary?._id,
      handleLibrarySelect,
      convertDurationToTime,
    ],
  );

  const panelStyle: CSSProperties = {
    marginBottom: 12,
    background: '#f5f5f5',
    borderRadius: 8,
    border: 'none',
  };

  const onWatchFinish = useCallback(async () => {
    if (!selectedLibrary || !lessonDetail?.modules) return;

    await handleVideoComplete();

    const libraries = lessonDetail.modules.flatMap(module => module.libraries);
    const currentIndex = libraries.findIndex(
      lib => lib._id === selectedLibrary._id,
    );
    const nextLibrary = libraries[currentIndex + 1] || null;

    if (nextLibrary && userId) {
      try {
        await setLibraryCanPlay({
          libraryId: nextLibrary._id,
          userId,
        });

        dispatch(dashboardAction.getLessonDetail({ id: lessonDetail._id }));
        dispatch(dashboardAction.setSelectedLibrary(nextLibrary));

        setVideoTrackingState({
          isTracking: false,
          lastTrackTime: 0,
          progress: 0,
          currentTime: 0,
          duration: 0,
          totalWatchedTime: 0,
        });

        fetchTrackingData(nextLibrary._id, true);
      } catch (error) {
        // Silently fail
      }
    }
  }, [
    selectedLibrary,
    lessonDetail,
    handleVideoComplete,
    setLibraryCanPlay,
    dispatch,
    userId,
    fetchTrackingData,
  ]);

  const showModal = useCallback(
    (
      correctCount: number,
      totalQuestions: number,
      score: string,
      isPass: boolean,
    ) => {
      modal.info({
        title: '📊 Result & Analytics',
        width: 800,
        content: (
          <View style={{ maxHeight: 500, overflow: 'auto' }}>
            <Tabs defaultActiveKey="1" size="large">
              <Tabs.TabPane tab="📝 Quiz Result" key="1">
                <View style={{ padding: 16 }}>
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 8,
                      }}>
                      Quiz Results
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#f8f9fa',
                        padding: 16,
                        borderRadius: 8,
                      }}>
                      <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>
                          ✅ Correct Answers:
                        </Text>{' '}
                        {correctCount}/{totalQuestions}
                      </Text>
                      <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>🏆 Score:</Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginLeft: 4,
                          }}>
                          {score}
                        </Text>{' '}
                        / 10
                      </Text>
                      <View
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          backgroundColor: isPass ? '#d4edda' : '#f8d7da',
                        }}>
                        {isPass ? (
                          <Text style={{ color: '#155724', margin: 0 }}>
                            <CheckCircleOutlined /> You have passed the exam!
                          </Text>
                        ) : (
                          <Text style={{ color: '#721c24', margin: 0 }}>
                            ❌ You have failed the exam. Please try again.
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 16, alignItems: 'center' }}>
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={refreshTrackingData}
                      loading={isRefreshing}>
                      🔄 Cập nhật dữ liệu người xem
                    </Button>
                  </View>
                </View>
              </Tabs.TabPane>
            </Tabs>
          </View>
        ),
        onOk: () => {
          if (isPass) {
            onWatchFinish();
          }
        },
        okText: 'Close',
      });
    },
    [modal, refreshTrackingData, isRefreshing, onWatchFinish],
  );

  const handleSubmit = useCallback(
    (selectedAnswers: any) => {
      if (!selectedLibrary || selectedLibrary.type !== 'Quiz') return;

      const totalQuestions = selectedLibrary.questionList.length;
      let correctCount = 0;

      selectedLibrary.questionList.forEach(question => {
        const userAnswer = selectedAnswers[question._id];
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      });

      const score = ((correctCount / totalQuestions) * 10).toFixed(2);
      const isPass = correctCount >= (2 / 3) * totalQuestions;

      handleVideoProgress(
        100,
        selectedLibrary.duration || 0,
        selectedLibrary.duration || 0,
      );

      refreshTrackingData().then(() => {
        setTimeout(() => {
          showModal(correctCount, totalQuestions, score, isPass);
        }, 500);
      });
    },
    [selectedLibrary, handleVideoProgress, refreshTrackingData, showModal],
  );

  useEffect(() => {
    if (selectedLibrary?._id) {
      fetchTrackingData(selectedLibrary._id, true);
    }
  }, [selectedLibrary?._id, fetchTrackingData]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (videoTrackingState.isTracking && selectedLibrary?._id) {
      intervalId = setInterval(() => {
        fetchTrackingData(selectedLibrary._id, false);
      }, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoTrackingState.isTracking, selectedLibrary?._id, fetchTrackingData]);

  const renderLibraryDetail = useMemo(() => {
    if (!selectedLibrary) return null;

    const commonProps = {
      ref: libraryRef,
      data: selectedLibrary,
      onWatchFinish: onWatchFinish,
      onVideoStart: handleVideoStart,
      onVideoProgress: handleVideoProgress,
      onVideoComplete: handleVideoComplete,
      onVideoPause: handleVideoPause,
      onVideoSeek: handleVideoSeek,
      onUserLeave: handleVideoPause,
      onUserInactive: handleVideoPause,
    };

    if (selectedLibrary.type === 'Text') {
      return (
        <>
          <View style={styles.layoutTitleContainer}>
            <Text style={styles.layoutTitle}>{selectedLibrary.title}</Text>
          </View>
          <LibraryDetailItem {...commonProps} />
        </>
      );
    }

    return (
      <>
        <LibraryDetailItem
          {...commonProps}
          onClickSubmit={
            selectedLibrary.type === 'Quiz' ? handleSubmit : undefined
          }
        />
        <View style={styles.layoutTitleContainer}>
          <Text style={styles.layoutTitle}>{selectedLibrary.title}</Text>
          {selectedLibrary.description && (
            <Text style={styles.description}>
              {selectedLibrary.description}
            </Text>
          )}
        </View>
      </>
    );
  }, [
    selectedLibrary,
    onWatchFinish,
    handleVideoStart,
    handleVideoProgress,
    handleVideoComplete,
    handleVideoPause,
    handleVideoSeek,
    handleSubmit,
  ]);

  const renderHeader = useMemo(
    () => (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          width: '100%',
        }}>
        <AppHeader
          title={selectedModule?.title}
          subTitle={lessonDetail?.title}
        />
      </View>
    ),
    [
      selectedModule?.title,
      lessonDetail?.title,
      selectedLibrary,
      refreshTrackingData,
      isRefreshing,
      trackingData,
    ],
  );

  return (
    <View style={styles.container}>
      {contextHolder}

      {renderHeader}

      <View style={{ flexDirection: 'row', gap: 24 }}>
        <ScrollView
          style={{ width: '70%' }}
          contentContainerStyle={{ paddingBottom: 100 }}>
          {renderLibraryDetail}
        </ScrollView>

        <ScrollView
          style={{ height: 1000, scrollbarWidth: 'none' }}
          contentContainerStyle={{ paddingBottom: 100 }}>
          {lessonDetail?.modules?.length > 0 && (
            <View style={{ gap: 24 }}>
              <FaceDetection
                onPauseVideo={() => {
                  if (videoTrackingState.currentTime > 0) {
                    handleVideoProgress(
                      videoTrackingState.progress,
                      videoTrackingState.currentTime,
                      videoTrackingState.duration,
                    );
                  }
                }}
              />

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
    </View>
  );
};

export default ModuleDetailPage;
