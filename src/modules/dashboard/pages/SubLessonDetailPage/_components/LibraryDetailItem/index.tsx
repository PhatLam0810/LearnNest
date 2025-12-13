'use client';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ScrollView, View } from 'react-native-web';
import { Document, Page } from 'react-pdf';
import { FullscreenOutlined } from '@ant-design/icons';
import { Library } from '~mdDashboard/types';
import styles from './styles';
import YouTube from 'react-youtube';
import { Button, Modal, Radio } from 'antd';
import axios from 'axios';
import { messageApi } from '@hooks';
import { useAppSelector } from '@redux';

type LibraryDetailItemProps = {
  data: Library;
  onWatchFinish?: () => void;
  onPauseVideo?: () => void;
  onClickSubmit?: (answerList: any) => void;
};
export interface LibraryDetailItemHandle {
  pauseAll: () => void;
}
const LibraryDetailItem = forwardRef<
  LibraryDetailItemHandle,
  LibraryDetailItemProps
>(({ data, onWatchFinish, onClickSubmit }, ref) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [lastPlayed, setLastPlayed] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);
  const [visibleQuestion, setVisibleQuestion] = useState<any>(null);
  const [shownQuestionIds, setShownQuestionIds] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>(
    {},
  );
  const [invalidQuestions, setInvalidQuestions] = useState<string[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [modal, contextHolder] = Modal.useModal();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:9999';

  const useVideoTracking = (subLessonId: string) => {
    const [isTracking, setIsTracking] = useState(false);
    const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastSentAtRef = useRef<number>(0);
    const lastPositionRef = useRef<number>(0);
    const maxWatchedRef = useRef<number>(0);
    const totalWatchedTimeRef = useRef<number>(0);
    const lastPlayStateRef = useRef<'playing' | 'paused'>('paused');
    const videoPlayingRef = useRef<boolean>(false);

    const userProfile = useAppSelector(
      (state: any) => state.authReducer?.tokenInfo?.userProfile,
    );
    const userId = userProfile?._id;

    const flushTracking = async (opts?: {
      force?: boolean;
      currentTime?: number;
      duration?: number;
      watchedSeconds?: number;
      progress?: number;
      completed?: boolean;
    }) => {
      try {
        if (!subLessonId || !userId) return;
        const now = Date.now();

        if (
          !opts?.force &&
          (now - lastSentAtRef.current < 5000 || !videoPlayingRef.current)
        ) {
          return;
        }

        const currentPos = opts?.currentTime || 0;
        const duration = opts?.duration || 0;
        const watchedSeconds =
          opts?.watchedSeconds || Math.max(maxWatchedRef.current, currentPos);
        let progress = opts?.progress;
        if (progress === undefined) {
          progress =
            duration > 0 ? Math.round((watchedSeconds / duration) * 100) : 0;
        } else {
          progress = Math.round(progress);
        }
        const completed = opts?.completed || progress >= 95;

        const payload: any = {
          userId,
          subLessonId,
          progress,
          duration,
          completed,
          watchedSeconds: Math.floor(watchedSeconds),
          currentTime: Math.floor(currentPos),
          lastPosition: Math.floor(currentPos),
          totalWatchedTime: Math.floor(totalWatchedTimeRef.current || 0),
        };

        const url = `${API_BASE_URL}/lesson/video/track`;
        await axios.post(url, payload, { timeout: 4000 });
        lastSentAtRef.current = now;

        const delta = Math.max(
          0,
          Math.floor(currentPos - (lastPositionRef.current || 0)),
        );
        totalWatchedTimeRef.current =
          Math.max(totalWatchedTimeRef.current, watchedSeconds) + delta;
        lastPositionRef.current = currentPos;
        maxWatchedRef.current = Math.max(maxWatchedRef.current, currentPos);

        return payload;
      } catch (error) {
        console.error('Error in flushTracking:', error);
        return null;
      }
    };

    const startPeriodicTracking = () => {
      if (trackingIntervalRef.current != null) return;
      trackingIntervalRef.current = setInterval(() => {
        if (videoPlayingRef.current) {
          flushTracking({ force: true });
        }
      }, 10000);
    };

    const stopPeriodicTracking = () => {
      if (trackingIntervalRef.current != null) {
        clearInterval(trackingIntervalRef.current);
        trackingIntervalRef.current = null;
      }
    };

    const startTracking = (currentTime: number = 0, duration: number = 0) => {
      if (!userId || !subLessonId) return;

      setIsTracking(true);
      videoPlayingRef.current = true;
      lastPlayStateRef.current = 'playing';
      lastPositionRef.current = currentTime;
      maxWatchedRef.current = Math.max(maxWatchedRef.current, currentTime);

      startPeriodicTracking();

      flushTracking({
        force: true,
        currentTime,
        duration,
        watchedSeconds: currentTime,
        progress: duration > 0 ? (currentTime / duration) * 100 : 0,
      });
    };

    const updateProgress = (currentTime: number, duration: number) => {
      if (!isTracking || !videoPlayingRef.current) return;

      maxWatchedRef.current = Math.max(maxWatchedRef.current, currentTime);
      lastPositionRef.current = currentTime;

      if (Math.abs(currentTime - lastSentAtRef.current) >= 1) {
        flushTracking({
          currentTime,
          duration,
          watchedSeconds: maxWatchedRef.current,
          progress: duration > 0 ? (maxWatchedRef.current / duration) * 100 : 0,
        });
      }
    };

    const stopTracking = (currentTime: number, duration: number) => {
      videoPlayingRef.current = false;
      lastPlayStateRef.current = 'paused';
      setIsTracking(false);
    };

    const pauseTracking = () => {
      videoPlayingRef.current = false;
      lastPlayStateRef.current = 'paused';
    };

    const resumeTracking = (currentTime: number, duration: number) => {
      videoPlayingRef.current = true;
      lastPlayStateRef.current = 'playing';
      setIsTracking(true);
    };

    const handleVideoEnd = (duration: number) => {
      stopPeriodicTracking();
      videoPlayingRef.current = false;
      maxWatchedRef.current = Math.max(maxWatchedRef.current, duration);

      flushTracking({
        force: true,
        currentTime: duration,
        duration,
        watchedSeconds: duration,
        progress: 100,
        completed: true,
      });

      setIsTracking(false);
      lastPlayStateRef.current = 'paused';
    };

    const cleanup = () => {
      stopPeriodicTracking();
      setIsTracking(false);
      videoPlayingRef.current = false;
      lastPlayStateRef.current = 'paused';
    };

    return {
      isTracking,
      startTracking,
      updateProgress,
      stopTracking,
      pauseTracking,
      resumeTracking,
      handleVideoEnd,
      cleanup,
    };
  };

  const {
    startTracking,
    updateProgress,
    pauseTracking,
    resumeTracking,
    handleVideoEnd,
  } = useVideoTracking(data._id);

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:[?&]v=|youtu\.be\/|embed\/)([^&]+)/);
    return match ? match[1] : null;
  };
  const player = playerRef.current;
  const video = videoRef.current;
  const videoStatus = useAppSelector(
    state => state.dashboardReducer.videoStatus,
  );
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = Math.floor(playerRef.current.getCurrentTime());
        const duration = playerRef.current.getDuration();
        const percentWatched = (maxWatched / duration) * 100;
        const matchedQuestion = data.questionList?.find(
          (q: any) =>
            q.appearTime === currentTime && !shownQuestionIds.includes(q._id),
        );
        if (matchedQuestion) {
          setVisibleQuestion(matchedQuestion);
          player?.pauseVideo();
          pauseTracking();
        }

        if (currentTime > maxWatched + 5) {
          warning();
          playerRef.current.pauseVideo();
          playerRef.current.seekTo(lastPlayed);
          pauseTracking();
        } else {
          setLastPlayed(currentTime);
          setMaxWatched(prevMax => Math.max(prevMax, currentTime));
          updateProgress(currentTime, duration);
        }
        if (percentWatched >= 99) {
          handleVideoEnd(duration);
          onWatchFinish?.();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastPlayed, data, shownQuestionIds, maxWatched, onWatchFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        const currentTime = Math.floor(videoRef.current.currentTime);
        const duration = videoRef.current.duration;
        const percentWatched = (maxWatched / duration) * 100;

        // Chặn tua quá 5 giây so với maxWatched
        const matchedQuestion = data.questionList?.find(
          (q: any) =>
            q.appearTime === currentTime && !shownQuestionIds.includes(q._id),
        );

        if (matchedQuestion) {
          setVisibleQuestion(matchedQuestion);
          video?.pause();
          pauseTracking();
        }

        if (currentTime > maxWatched + 5) {
          warning();
          videoRef.current.pause();
          videoRef.current.currentTime = lastPlayed;
          pauseTracking();
        } else {
          setLastPlayed(currentTime);
          setMaxWatched(prevMax => Math.max(prevMax, currentTime));
          updateProgress(currentTime, duration);
        }

        // Nếu đã xem trên 99% thì gọi onWatchFinish
        if (percentWatched >= 99) {
          handleVideoEnd(duration);
          onWatchFinish?.();
          setMaxWatched(0);
          clearInterval(interval);
        }
        if (!videoStatus) {
          video?.pause();
          pauseTracking();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    lastPlayed,
    data,
    shownQuestionIds,
    videoStatus,
    maxWatched,
    onWatchFinish,
  ]);

  useImperativeHandle(ref, () => ({
    pauseAll: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        pauseTracking();
      }
      if (playerRef.current) {
        playerRef.current.pauseVideo();
        pauseTracking();
      }
    },
  }));
  const handleClose = () => {
    if (!visibleQuestion || selectedAnswer === null) return;
    const isCorrect = selectedAnswer === visibleQuestion.correctAnswer;
    const player = playerRef.current;
    const video = videoRef.current;
    if (isCorrect) {
      // ✅ Đúng → cho chạy tiếp, không hiện lại
      player?.playVideo?.();
      video?.play?.();
      setShownQuestionIds(prev => [...prev, visibleQuestion._id]);
      setVisibleQuestion(null);
      setSelectedAnswer(null);

      if (player) {
        const duration = player.getDuration();
        const currentTime = player.getCurrentTime();
        if (duration) {
          resumeTracking(currentTime, duration);
        }
      }
      if (video && video.duration) {
        resumeTracking(video.currentTime, video.duration);
      }
    } else {
      // ❌ Sai → ẩn Modal + tua về → cho phép hiện lại
      const appearTime = visibleQuestion.appearTime;

      player?.pauseVideo?.();
      player?.seekTo?.(Math.max(0, maxWatched - 5));

      if (video) {
        video.pause();
        video.currentTime = Math.max(0, maxWatched - 5);
      }

      setShownQuestionIds(prev =>
        prev.filter(id => id !== visibleQuestion._id),
      ); // ❌ Xóa khỏi list đã hiện
      setVisibleQuestion(null);
      setSelectedAnswer(null);
    }
  };

  const warning = () => {
    modal.warning({
      title: 'Warning',
      content:
        'You are learning faster than usual, please avoid skipping too much while studying!',
      centered: true,
    });
  };

  const handleSubmit = () => {
    const unansweredIds = data.questionList
      .filter((q: any) => !selectedAnswers[q._id])
      .map((q: any) => q._id);

    if (unansweredIds.length > 0) {
      setInvalidQuestions(unansweredIds);
      messageApi.error('You must select all the questions!');
      return;
    }

    // Nếu hợp lệ
    setInvalidQuestions([]); // clear
    onClickSubmit(selectedAnswers);
  };

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (data?.questionList?.length > 0) {
      const questionsWithShuffledAnswers = data.questionList.map((q: any) => ({
        ...q,
      }));

      const shuffled = shuffleArray(questionsWithShuffledAnswers);
      setShuffledQuestions(shuffled);
    }
  }, [data]);

  const renderMedia = () => {
    if (!data?.type) return null;

    switch (data.type) {
      case 'Video':
      case 'Youtube':
        return (
          <View style={styles.mediaContainer}>
            {data.url.includes('https://storage.googleapis.com') ? (
              <video
                ref={videoRef}
                src={data.url}
                width="100%"
                height="100%"
                autoPlay={false}
                controls
                controlsList="nodownload noseek"
                onPlay={() => {
                  if (videoRef.current && videoRef.current.duration) {
                    resumeTracking(
                      videoRef.current.currentTime,
                      videoRef.current.duration,
                    );
                  }
                }}
                onPause={() => {
                  if (videoRef.current && videoRef.current.duration) {
                    pauseTracking();
                  }
                }}
                onEnded={() => {
                  if (videoRef.current) {
                    handleVideoEnd(videoRef.current.duration);
                    onWatchFinish?.();
                  }
                }}
              />
            ) : (
              <View
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%',
                }}>
                <YouTube
                  videoId={getYoutubeId(data.url)}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: { controls: 1, autoplay: 0 },
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  onReady={(event: any) => (playerRef.current = event.target)}
                  onPlay={() => {
                    if (playerRef.current) {
                      const duration = playerRef.current.getDuration();
                      const currentTime = playerRef.current.getCurrentTime();
                      if (duration) {
                        resumeTracking(currentTime, duration);
                      }
                    }
                  }}
                  onPause={() => {
                    if (playerRef.current) {
                      pauseTracking();
                    }
                  }}
                  onEnd={() => {
                    if (playerRef.current) {
                      const duration = playerRef.current.getDuration();
                      handleVideoEnd(duration);
                      onWatchFinish?.();
                    }
                  }}
                />
              </View>
            )}
          </View>
        );
      case 'PDF':
        return (
          <View style={styles.pdfContainer}>
            <Document
              className="document"
              file={data.url}
              onLoadSuccess={handleDocumentLoadSuccess}>
              {Array.from({ length: numPages || 0 }, (_i, index) => (
                <Page key={index} pageNumber={index + 1} />
              ))}
            </Document>
            <View style={styles.fullscreenButton}>
              <FullscreenOutlined />
            </View>
          </View>
        );
      case 'Text':
        return (
          <ScrollView
            style={{
              height: 1000,
              scrollbarWidth: 'none',
              paddingBottom: 400,
            }}>
            <View>
              {shuffledQuestions.map((question: any, index: number) => {
                const isInvalid = invalidQuestions.includes(question._id);

                return (
                  <View key={index} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        ...styles.questionTitle,
                        color: isInvalid ? 'red' : 'black',
                      }}>
                      {index + 1}. Question {question.question} ?
                    </div>

                    <Radio.Group
                      onChange={e => {
                        const selectedValue = e.target.value;
                        const questionId = question._id;

                        setSelectedAnswers((prev: any) => ({
                          ...prev,
                          [questionId]: selectedValue,
                        }));

                        setInvalidQuestions(prevInvalid => {
                          if (prevInvalid.includes(questionId)) {
                            return prevInvalid.filter(id => id !== questionId);
                          }
                          return prevInvalid;
                        });
                      }}
                      value={selectedAnswers[question._id]}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}>
                      {question.answerList.map((ans: any, idx: number) => {
                        const optionLetter = String.fromCharCode(65 + idx);
                        return (
                          <Radio key={idx} value={optionLetter}>
                            <div style={styles.answerTitle}>
                              {optionLetter}. {ans}
                            </div>
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  </View>
                );
              })}
            </View>
            <Button type="primary" onClick={handleSubmit} style={styles.button}>
              Submit
            </Button>
          </ScrollView>
        );
      default:
        return null;
    }
  };
  return (
    <View>
      {renderMedia()}
      {contextHolder}
      <Modal
        open={visibleQuestion}
        centered
        closable={false}
        style={{ width: 1000 }}
        title={
          <div style={styles.questionTitle}>
            Question {visibleQuestion?.question}?
          </div>
        }
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={handleClose}
            style={styles.button}
            disabled={selectedAnswer === null}>
            Submit
          </Button>,
        ]}>
        {visibleQuestion && (
          <Radio.Group
            onChange={e => setSelectedAnswer(e.target.value)}
            value={selectedAnswer}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleQuestion.answerList.map((ans: any, idx: number) => {
              const optionLetter = String.fromCharCode(65 + idx);
              return (
                <Radio key={idx} value={optionLetter}>
                  <div style={styles.answerTitle}>
                    {optionLetter}. {ans}
                  </div>
                </Radio>
              );
            })}
          </Radio.Group>
        )}
      </Modal>
    </View>
  );
});
LibraryDetailItem.displayName = 'LibraryDetailItem';
export default LibraryDetailItem;
