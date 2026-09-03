'use client';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ScrollView, Text, View } from 'react-native-web';
import { Library } from '~mdDashboard/types';
import styles from './styles';
import PdfLessonViewer from '../PdfLessonViewer';
import YouTube from 'react-youtube';
import { Button, Modal, Radio, Spin } from 'antd';
import api from '@/services/api';
import { messageApi } from '@hooks';
import { useAppSelector } from '@redux';
import { dashboardQuery, useGetLessonProgressQuery } from '~mdDashboard/redux';
import ResumeLessonModal from '@components/ResumeLessonModal';
import { useResponsive } from '@/styles/responsive';

// How far ahead of the furthest-watched point a forward seek may freely
// jump (no warning). Seeking past this triggers the warning + rewind and
// starts a cooldown during which no further seeking is allowed at all —
// only after watching through the cooldown does seeking free up again.
const SEEK_ALLOWANCE_SECONDS = 180;
const SEEK_COOLDOWN_MS = 120_000;
// Interval tick is 1s, so normal forward playback advances currentTime by
// ~1s each tick while maxWatched (updated at the end of that same tick)
// still holds the previous tick's value — currentTime > maxWatched is true
// on EVERY tick of ordinary playback, not just on a real seek. Only treat
// it as a jump if the advance since the last tick clearly exceeds normal
// playback speed (with slack for interval jitter under load).
const SEEK_JUMP_THRESHOLD_SECONDS = 3;

type LibraryDetailItemProps = {
  data: Library;
  dataQuestion?: any;
  lessonId?: string;
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
>(({ data, dataQuestion, lessonId, onWatchFinish, onClickSubmit }, ref) => {
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const correctingSkipRef = useRef(false);
  // While the anti-skip warning modal is open, suppress the quiz-question
  // modal so the two don't stack on top of each other.
  const warningModalOpenRef = useRef(false);
  // Timestamp (ms) until which forward-seeking is blocked entirely. Seeking
  // ahead up to SEEK_ALLOWANCE_SECONDS is a one-shot allowance — using it at
  // all starts this cooldown, during which even a small forward seek is
  // blocked (must watch through in real time until it expires).
  const skipCooldownUntilRef = useRef(0);
  // lastPlayed/maxWatched KHÔNG render ra UI gì (chỉ dùng nội bộ cho logic
  // chống tua trong interval bên dưới) — trước đây là useState, khiến toàn
  // bộ component re-render + effect chứa interval bị teardown/tạo lại MỚI
  // MỖI GIÂY (vì chính 2 state này nằm trong dependency array và bị chính
  // interval đó cập nhật mỗi tick) — đo được ~12 lần tạo lại interval/6s
  // (đáng lẽ 1 lần). Đổi hẳn sang ref vì không có gì đọc giá trị "render"
  // của chúng — chỉ cần luôn mới nhất tại thời điểm interval tick, ref đã
  // đủ và không kéo theo re-render nào.
  const lastPlayedRef = useRef(0);
  const maxWatchedGuardRef = useRef(0);
  const setGuardedMaxWatched = (value: number | ((prev: number) => number)) => {
    const next =
      typeof value === 'function'
        ? (value as (prev: number) => number)(maxWatchedGuardRef.current)
        : value;
    maxWatchedGuardRef.current = next;
  };
  const setGuardedLastPlayed = (value: number) => {
    lastPlayedRef.current = value;
  };
  const [visibleQuestion, setVisibleQuestion] = useState<any>(null);
  const [shownQuestionIds, setShownQuestionIds] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>(
    {},
  );
  const [invalidQuestions, setInvalidQuestions] = useState<string[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [modal, contextHolder] = Modal.useModal();
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);
  const [resumeInfo, setResumeInfo] = useState<any>(null);
  const [isConfirmingResume, setIsConfirmingResume] = useState(false);
  const [isSwitchingContext, setIsSwitchingContext] = useState(false);
  const activeModalRef = useRef<any>(null);

  const userProfile = useAppSelector(
    (state: any) => state.authReducer?.tokenInfo?.userProfile,
  );
  const userId = userProfile?._id;
  const isAdmin = userProfile?.role?.level <= 2;
  const [checkAnswer] = dashboardQuery.useCheckAnswerMutation();
  const { isMobile } = useResponsive();

  const {
    currentData: progressRes,
    isFetching,
    isLoading,
  } = useGetLessonProgressQuery(
    {
      userId: userId ?? '',
      subLessonId: data?._id ?? '',
      lessonId: lessonId,
    },
    {
      skip:
        !userId ||
        !data?._id ||
        (data.type !== 'Video' && data.type !== 'Youtube'),
      refetchOnMountOrArgChange: true,
    },
  );

  const useVideoTracking = (subLessonId: string, lessonId?: string) => {
    const [isTracking, setIsTracking] = useState(false);
    const trackingIntervalRef = useRef<any | null>(null);
    const lastSentAtRef = useRef<number>(0);
    const lastSentPositionRef = useRef<number>(0);
    const lastPositionRef = useRef<number>(0);
    const maxWatchedRef = useRef<number>(0);
    const totalWatchedTimeRef = useRef<number>(0);
    const lastPlayStateRef = useRef<'playing' | 'paused'>('paused');
    const videoPlayingRef = useRef<boolean>(false);

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

        if (lessonId) {
          payload.lessonId = lessonId;
        }

        await api.post('/lesson/video/track', payload, { timeout: 4000 });
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

      if (Math.abs(currentTime - lastSentPositionRef.current) >= 1) {
        lastSentPositionRef.current = currentTime;
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
  } = useVideoTracking(data._id, lessonId);

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:[?&]v=|youtu\.be\/|embed\/)([^&]+)/);
    return match ? match[1] : null;
  };
  const player = playerRef.current;
  const video = videoRef.current;
  const videoStatus = useAppSelector(
    state => state.dashboardReducer.videoStatus,
  );
  // Trước đây đây là 2 useEffect gần như y hệt nhau (1 cho YouTube qua
  // playerRef, 1 cho HTML5 <video> qua videoRef) LUÔN CÙNG CHẠY bất kể loại
  // media nào đang thật sự hiển thị — cái không dùng tới vẫn no-op mỗi giây
  // nhưng cả 2 đều bị teardown/tạo lại (vì lastPlayed/maxWatched vốn là
  // state, nằm trong dependency array, lại chính là 2 giá trị bị chính
  // interval này cập nhật mỗi tick). Gộp làm 1, tự chọn ref đang có dữ liệu
  // (player YouTube hay video HTML5) — giảm 1 nửa số interval, và với
  // lastPlayed/maxWatched giờ đã là ref (không còn trigger re-render/teardown
  // effect), interval chỉ còn được tạo 1 lần mỗi khi đổi bài học thay vì mỗi
  // giây (đo được: 12 lần tạo lại/6s trước khi sửa → còn 1 lần sau khi sửa).
  useEffect(() => {
    const interval = setInterval(() => {
      const isYoutube = !!playerRef.current;
      const isHtml5 = !!videoRef.current;
      if (!isYoutube && !isHtml5) return;

      const currentTime = isYoutube
        ? Math.floor(playerRef.current.getCurrentTime())
        : Math.floor(videoRef.current!.currentTime);
      const duration = isYoutube
        ? playerRef.current.getDuration()
        : videoRef.current!.duration;
      const percentWatched = (maxWatchedGuardRef.current / duration) * 100;
      // So sánh "đã tới hoặc qua mốc" thay vì đúng bằng tuyệt đối — interval
      // chạy mỗi 1s có thể trôi/nhảy qua đúng giây appearTime, khiến so
      // sánh === bỏ lỡ mốc vĩnh viễn. shownQuestionIds đảm bảo không hiện
      // lại câu đã trả lời.
      const matchedQuestion = data.questionList?.find(
        (q: any) =>
          q.appearTime <= currentTime && !shownQuestionIds.includes(q._id),
      );

      const inCooldown = Date.now() < skipCooldownUntilRef.current;
      const jumpsAhead =
        currentTime - lastPlayedRef.current > SEEK_JUMP_THRESHOLD_SECONDS &&
        currentTime > maxWatchedGuardRef.current;
      const exceedsAllowance =
        currentTime > maxWatchedGuardRef.current + SEEK_ALLOWANCE_SECONDS;
      // Decide up front whether the warning modal will fire this same
      // tick — the question check must know this BEFORE it runs, not
      // after, otherwise both modals can open together in the same tick.
      const willWarn =
        !isAdmin &&
        jumpsAhead &&
        (inCooldown || exceedsAllowance) &&
        !correctingSkipRef.current;

      if (matchedQuestion && !warningModalOpenRef.current && !willWarn) {
        setVisibleQuestion(matchedQuestion);
        // Đọc thẳng ref, không dùng biến player/video ở scope ngoài (chỉ
        // được gán lại mỗi lần component render) - effect này giờ chỉ được
        // tạo lại khi đổi bài học, không còn re-render/re-tạo mỗi giây nữa
        // để "vô tình" giữ 2 biến đó luôn mới như trước khi sửa.
        if (isYoutube) playerRef.current?.pauseVideo();
        else videoRef.current?.pause();
        pauseTracking();
      }

      if (!isAdmin && jumpsAhead && (inCooldown || exceedsAllowance)) {
        if (!correctingSkipRef.current) {
          correctingSkipRef.current = true;
          if (exceedsAllowance) {
            // Real violation (jumped past the free allowance) — (re)start
            // the cooldown that blocks further seeking until it expires.
            skipCooldownUntilRef.current = Date.now() + SEEK_COOLDOWN_MS;
          }
          warning();
          if (isYoutube) {
            playerRef.current.pauseVideo();
            // allowSeekAhead=true so YouTube fetches the target position
            // instead of silently freezing when it isn't buffered yet.
            playerRef.current.seekTo(lastPlayedRef.current, true);
          } else {
            videoRef.current!.pause();
            videoRef.current!.currentTime = lastPlayedRef.current;
          }
          pauseTracking();
          // Give the player time to actually complete the seek before
          // re-checking — otherwise the still-stale currentTime on the
          // next tick re-triggers this block and re-issues pause/seek,
          // which is what produced the "stuck loading" symptom.
          setTimeout(() => {
            correctingSkipRef.current = false;
          }, 2000);
        }
      } else {
        // Forward seeks within the free allowance are accepted silently —
        // no warning, no cooldown — the cooldown only starts on an actual
        // violation above.
        setGuardedLastPlayed(currentTime);
        setGuardedMaxWatched(prevMax => Math.max(prevMax, currentTime));
        updateProgress(currentTime, duration);
      }

      if (percentWatched >= 99) {
        handleVideoEnd(duration);
        onWatchFinish?.();
        if (isHtml5) {
          setGuardedMaxWatched(0);
          clearInterval(interval);
        }
      }
      if (isHtml5 && !videoStatus) {
        videoRef.current?.pause();
        pauseTracking();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data, shownQuestionIds, videoStatus, onWatchFinish, isAdmin]);

  useImperativeHandle(ref, () => ({
    pauseAll: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        pauseTracking();
      }
      if (playerRef.current) {
        try {
          if (
            typeof playerRef.current.pauseVideo === 'function' &&
            playerRef.current.getIframe()
          ) {
            playerRef.current.pauseVideo();
            pauseTracking();
          }
        } catch (e) {}
      }
    },
  }));

  const handleClose = async () => {
    if (!visibleQuestion || selectedAnswer === null) return;
    // Chấm điểm ở server — correctAnswer không còn được gửi về client nữa
    // (xem lesson.service.ts#getLessonData), nên phải hỏi server câu này
    // đúng hay sai thay vì so sánh tay như trước.
    let isCorrect = false;
    try {
      const res = await checkAnswer({
        libraryId: data._id,
        questionId: visibleQuestion._id,
        answer: selectedAnswer,
      }).unwrap();
      isCorrect = res.correct;
    } catch (err) {
      messageApi.error('Không thể kiểm tra đáp án, vui lòng thử lại.');
      return;
    }
    const player = playerRef.current;
    const video = videoRef.current;
    if (isCorrect) {
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
      // Tua về TRƯỚC appearTime (không phải maxWatched — điểm đó vẫn sau
      // appearTime, nên với so sánh appearTime <= currentTime, tick kế tiếp
      // sẽ khớp lại ngay lập tức và mở popup liên tục mà không cho xem lại
      // đoạn nào cả, biến thành đoán mò tới khi đúng).
      const rewindTo = Math.max(0, visibleQuestion.appearTime - 5);

      player?.pauseVideo?.();
      player?.seekTo?.(rewindTo, true);

      if (video) {
        video.pause();
        video.currentTime = rewindTo;
      }

      setGuardedLastPlayed(rewindTo);
      setShownQuestionIds(prev =>
        prev.filter(id => id !== visibleQuestion._id),
      );
      setVisibleQuestion(null);
      setSelectedAnswer(null);
    }
  };

  const warning = () => {
    warningModalOpenRef.current = true;
    modal.warning({
      title: 'Cảnh báo',
      content:
        'Bạn đang học nhanh hơn bình thường, vui lòng tránh bỏ qua quá nhiều khi học!',
      centered: true,
      onOk: () => {
        warningModalOpenRef.current = false;
      },
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

    setInvalidQuestions([]);
    setSelectedAnswers({});
    if (onClickSubmit) {
      onClickSubmit(selectedAnswers);
    }
  };

  const handleResumeLesson = () => {
    setIsConfirmingResume(false);
    setIsSwitchingContext(false);

    if (resumeInfo) {
      setGuardedMaxWatched(
        resumeInfo.watchedSeconds || resumeInfo.lastPosition,
      );
      setGuardedLastPlayed(resumeInfo.lastPosition);

      if (data.type === 'Video' && videoRef.current) {
        videoRef.current.currentTime = resumeInfo.lastPosition;
        videoRef.current.play();
      } else if (data.type === 'Youtube' && playerRef.current) {
        playerRef.current.seekTo(resumeInfo.lastPosition, true);
        playerRef.current.playVideo();
      } else {
        setPendingSeek(resumeInfo.lastPosition);
      }
    }
  };

  const handleRestartLesson = () => {
    setIsConfirmingResume(false);
    setGuardedMaxWatched(0);
    setGuardedLastPlayed(0);
    setPendingSeek(null);
    setIsSwitchingContext(false);

    if (data.type === 'Video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else if (data.type === 'Youtube' && playerRef.current) {
      playerRef.current.seekTo(0, true);
      playerRef.current.playVideo();
    }
  };

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (dataQuestion?.length > 0) {
      const questionsWithShuffledAnswers = dataQuestion.map((q: any) => ({
        ...q,
      }));

      const shuffled = shuffleArray(questionsWithShuffledAnswers);
      setShuffledQuestions(shuffled);
    }
  }, [dataQuestion]);
  useEffect(() => {
    if (!data?._id) return;

    if (videoRef.current) {
      videoRef.current.pause();
    }

    if (playerRef.current) {
      try {
        if (
          typeof playerRef.current.pauseVideo === 'function' &&
          playerRef.current.getIframe()
        ) {
          playerRef.current.pauseVideo();
        }
      } catch (e) {
        console.warn('Failed to pause stale YouTube player:', e);
      }
      playerRef.current = null;
    }

    pauseTracking();

    setGuardedLastPlayed(0);
    setGuardedMaxWatched(0);
    setVisibleQuestion(null);
    setShownQuestionIds([]);
    setSelectedAnswer(null);
    setSelectedAnswers({});
    setInvalidQuestions([]);
    setPendingSeek(null);

    if (data.type === 'Video' || data.type === 'Youtube') {
      setIsSwitchingContext(true);
    }

    setIsConfirmingResume(false);
    setResumeInfo(null);

    return () => {
      if (activeModalRef.current) {
        activeModalRef.current.destroy();
        activeModalRef.current = null;
      }
    };
  }, [data?._id, lessonId]);

  useEffect(() => {
    if (isFetching || !data?._id) {
      setIsConfirmingResume(false);
      return;
    }

    if (progressRes) {
      if (progressRes.subLessonId && progressRes.subLessonId !== data._id) {
        return;
      }

      if (progressRes.lastPosition > 5 && !progressRes.completed) {
        setResumeInfo(progressRes);
        setIsConfirmingResume(true);
      } else {
        setIsConfirmingResume(false);
        setTimeout(() => setIsSwitchingContext(false), 300);
      }
    } else {
      setIsConfirmingResume(false);
      setIsSwitchingContext(false);
    }
  }, [progressRes, isFetching, data?._id]);

  // Safety net: if the progress request hangs/never resolves (seen on some
  // browsers, e.g. Cốc Cốc blocking the request), the black loading overlay
  // above the video would otherwise stay stuck forever while audio keeps playing.
  useEffect(() => {
    if (!isSwitchingContext) return;
    const timeout = setTimeout(() => setIsSwitchingContext(false), 5000);
    return () => clearTimeout(timeout);
  }, [isSwitchingContext, data?._id]);
  const renderMedia = () => {
    if (!data?.type) return null;

    const OverlayLoading = () =>
      isSwitchingContext || isConfirmingResume ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}>
          {isSwitchingContext && <Spin size="large" />}
        </div>
      ) : null;

    switch (data.type) {
      case 'Video':
      case 'Youtube':
        if (!data.url) {
          return (
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonText}>
                Khóa học này sẽ sớm ra mắt, mời bạn đón chờ nhé!
              </Text>
            </View>
          );
        }
        return (
          <View style={{ ...styles.mediaContainer, position: 'relative' }}>
            <OverlayLoading />
            {data.url.includes('https://storage.googleapis.com') ? (
              <video
                key={data._id}
                ref={videoRef}
                src={data.url}
                width="100%"
                height="100%"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
                autoPlay={false}
                controls
                controlsList="nodownload noseek"
                onLoadedMetadata={() => {
                  if (videoRef.current && pendingSeek !== null) {
                    videoRef.current.currentTime = pendingSeek;
                    setPendingSeek(null);
                  }
                }}
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
              <View style={styles.youtubeWrapper}>
                <YouTube
                  key={data._id}
                  videoId={getYoutubeId(data.url)}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: { controls: 1, autoplay: 0 },
                  }}
                  style={styles.youtubePlayer}
                  onReady={(event: any) => {
                    playerRef.current = event.target;
                    if (pendingSeek !== null) {
                      event.target.seekTo(pendingSeek, true);
                      setPendingSeek(null);
                    }
                  }}
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
        // Trình xem PDF riêng (react-pdf) thay cho iframe gốc: cần biết
        // trang hiện tại / tổng số trang để tính tiến độ và "đọc hết trang
        // cuối = hoàn thành" giống như video — iframe không cho biết điều
        // đó. Kèm nút chuyển trang / zoom / tải / in.
        return (
          <PdfLessonViewer
            data={data}
            lessonId={lessonId}
            userId={userId}
            onComplete={() => onWatchFinish?.()}
          />
        );
      case 'Text':
        return (
          <ScrollView
            style={{
              ...styles.quizContainer,
              ...(isMobile ? styles.quizContainerMobile : {}),
            }}>
            <View style={styles.quizContent}>
              {shuffledQuestions.map((question: any, index: number) => {
                const isInvalid = invalidQuestions.includes(question._id);
                return (
                  <View
                    key={question._id}
                    style={{
                      ...styles.questionCard,
                      ...(isMobile ? styles.questionCardMobile : {}),
                      ...(isInvalid ? styles.questionCardInvalid : {}),
                    }}>
                    <div
                      style={{
                        ...styles.questionTop,
                        ...(isMobile ? styles.questionTopMobile : {}),
                      }}>
                      <div
                        style={{
                          ...styles.questionNumber,
                          ...(isMobile ? styles.questionNumberMobile : {}),
                        }}>
                        {index + 1}
                      </div>
                      <div
                        style={{
                          ...styles.questionText,
                          ...(isMobile ? styles.questionTextMobile : {}),
                          color: isInvalid ? '#ef4444' : '#111827',
                        }}>
                        {question.question}
                      </div>
                    </div>
                    <Radio.Group
                      className="customQuizRadio"
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
                      style={styles.answerGroup}>
                      {question.answerList.map((ans: any, idx: number) => {
                        const optionLetter = String.fromCharCode(65 + idx);
                        const isSelected =
                          selectedAnswers[question._id] === optionLetter;
                        return (
                          <div
                            key={idx}
                            style={{
                              ...styles.answerOption,
                              ...(isMobile ? styles.answerOptionMobile : {}),
                              ...(isSelected
                                ? styles.answerOptionSelected
                                : {}),
                            }}>
                            <Radio
                              rootClassName="hide-default-radio"
                              className="customQuizRadioItem"
                              value={optionLetter}
                              style={styles.radioButton}>
                              <div
                                style={{
                                  ...styles.answerContent,
                                  ...(isMobile
                                    ? styles.answerContentMobile
                                    : {}),
                                }}>
                                <div
                                  style={{
                                    ...styles.answerLetterBox,
                                    ...(isMobile
                                      ? styles.answerLetterBoxMobile
                                      : {}),
                                    ...(isSelected
                                      ? styles.answerLetterBoxSelected
                                      : {}),
                                  }}>
                                  {optionLetter}
                                </div>
                                <div
                                  style={{
                                    ...styles.answerLabel,
                                    ...(isMobile
                                      ? styles.answerLabelMobile
                                      : {}),
                                  }}>
                                  {ans}
                                </div>
                              </div>
                            </Radio>
                          </div>
                        );
                      })}
                    </Radio.Group>
                  </View>
                );
              })}
            </View>

            {/* FOOTER */}
            <View
              style={{
                ...styles.quizFooter,
                ...(isMobile ? styles.quizFooterMobile : {}),
              }}>
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{
                  ...styles.submitQuizButton,
                  ...(isMobile ? styles.submitQuizButtonMobile : {}),
                }}>
                Nộp bài
              </Button>
            </View>
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
        footer={null}
        maskStyle={{
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
        width={600}
        styles={{
          content: {
            borderRadius: 16,
            padding: 0,
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          },
        }}>
        <div style={styles.modalWrapper}>
          {/* HEADER */}
          <div style={styles.modalHeader}>
            <div style={styles.modalTitle}>
              Câu hỏi {visibleQuestion?.question}
            </div>
          </div>

          {/* BODY */}
          <div style={styles.modalBody}>
            {visibleQuestion?.answerList?.map((ans: any, idx: number) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === letter;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedAnswer(letter)}
                  style={{
                    ...styles.answerCard,
                    ...(isSelected ? styles.answerCardSelected : {}),
                  }}>
                  <div style={styles.answerLetter}>{letter}</div>
                  <div style={styles.answerText}>{ans}</div>
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div style={styles.modalFooter}>
            <Button
              type="primary"
              disabled={!selectedAnswer}
              onClick={handleClose}
              style={styles.submitButton}>
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
      <ResumeLessonModal
        open={
          isConfirmingResume &&
          !isFetching &&
          (!progressRes?.subLessonId || progressRes.subLessonId === data?._id)
        }
        resumeInfo={resumeInfo}
        onRestart={handleRestartLesson}
        onResume={handleResumeLesson}
      />
    </View>
  );
});
LibraryDetailItem.displayName = 'LibraryDetailItem';
export default LibraryDetailItem;
