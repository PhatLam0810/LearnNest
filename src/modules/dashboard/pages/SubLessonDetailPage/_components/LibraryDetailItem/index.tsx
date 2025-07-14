/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native-web';
import { Document, Page } from 'react-pdf';
import { FullscreenOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
import { Library } from '~mdDashboard/types';
import styles from './styles';
import { handleConvert } from './functions';
import NextImage from 'next/image';
import YouTube from 'react-youtube';
import { Button, Modal, Radio } from 'antd';
import { messageApi } from '@hooks';

type LibraryDetailItemProps = {
  data: Library;
  onWatchFinish?: () => void;
  onClickSubmit?: (answerList: any) => void;
};

const LibraryDetailItem: React.FC<LibraryDetailItemProps> = ({
  data,
  onWatchFinish,
  onClickSubmit,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  const playerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [lastPlayed, setLastPlayed] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);
  const [visibleQuestion, setVisibleQuestion] = useState(null);
  const [shownQuestionIds, setShownQuestionIds] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [invalidQuestions, setInvalidQuestions] = useState<string[]>([]);

  const [modal, contextHolder] = Modal.useModal();

  const getYoutubeId = url => {
    const match = url.match(/(?:[?&]v=|youtu\.be\/|embed\/)([^&]+)/);
    return match ? match[1] : null;
  };
  const player = playerRef.current;
  const video = videoRef.current;

  useEffect(() => {
    const interval = setInterval(() => {
      const isYouTube = !!player;

      const currentTime = isYouTube
        ? Math.floor(player?.getCurrentTime?.() || 0)
        : Math.floor(video?.currentTime || 0);
      const duration = isYouTube
        ? player?.getDuration?.() || 1
        : video?.duration || 1;

      if (!duration) return;

      const percentWatched = (maxWatched / duration) * 100;

      // 🎯 Nếu đến đúng appearTime và chưa hiện câu hỏi này
      const matchedQuestion = data.questionList.find(
        q => q.appearTime === currentTime && !shownQuestionIds.includes(q._id),
      );

      if (matchedQuestion) {
        setVisibleQuestion(matchedQuestion);
        isYouTube ? player.pauseVideo() : video.pause();
      }

      // ✅ Chặn tua quá xa
      if (currentTime > maxWatched + 5) {
        warning();
        isYouTube
          ? (player.pauseVideo(), player.seekTo(lastPlayed))
          : (video.pause(), (video.currentTime = lastPlayed));
      } else {
        setLastPlayed(currentTime);
        setMaxWatched(prev => Math.max(prev, currentTime));
      }

      // ✅ Nếu xem xong
      if (percentWatched >= 99) {
        onWatchFinish();
        clearInterval(interval);
        setMaxWatched(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastPlayed, data, shownQuestionIds]);

  const handleClose = () => {
    if (!visibleQuestion || selectedAnswer === null) return;
    const isCorrect = selectedAnswer === visibleQuestion.correctAnswer;
    const player = playerRef.current;
    const video = videoRef.current;
    if (isCorrect) {
      // ✅ Đúng → cho chạy tiếp, không hiện lại
      player?.playVideo?.();
      video?.play?.();
      setShownQuestionIds(prev => [...prev, visibleQuestion._id]); // ✅ đánh dấu là đã hiện và đúng
      setVisibleQuestion(null);
      setSelectedAnswer(null);
    } else {
      // ❌ Sai → ẩn Modal + tua về → cho phép hiện lại
      const appearTime = visibleQuestion.appearTime;

      player?.pauseVideo?.();
      player?.seekTo?.(maxWatched - appearTime);

      if (video) {
        video.pause();
        video.currentTime = appearTime;
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
      .filter(q => !selectedAnswers[q._id]) // chưa chọn
      .map(q => q._id);

    if (unansweredIds.length > 0) {
      setInvalidQuestions(unansweredIds);
      messageApi.error('You must select all the questions!');
      return;
    }

    // Nếu hợp lệ
    setInvalidQuestions([]); // clear
    onClickSubmit(selectedAnswers);
  };

  const shuffleArray = array => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    if (data?.questionList?.length > 0) {
      const questionsWithShuffledAnswers = data.questionList.map(q => {
        return {
          ...q,
        };
      });

      const shuffled = shuffleArray(questionsWithShuffledAnswers);
      setShuffledQuestions(shuffled);
    }
  }, [data]);

  const renderMedia = () => {
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
                controls
                controlsList="nodownload noseek"
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
                    playerVars: { controls: 1, autoplay: 1 },
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  onReady={event => (playerRef.current = event.target)}
                />
              </View>
            )}
          </View>
        );
      case 'Short':
        return (
          <View style={styles.mediaContainer}>
            {data.url.includes('https://drive.google.com') ? (
              <iframe
                src={handleConvert(data.url)}
                width="100%"
                height="100%"
                allow="autoplay"
                allowFullScreen
              />
            ) : (
              <ReactPlayer
                width="100%"
                height="100%"
                controls
                key={data.url}
                url={data.url}
              />
            )}
          </View>
        );
      case 'Image':
        return (
          <View style={styles.mediaContainer}>
            <NextImage fill src={data.url} style={styles.image} alt="" />
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
          <>
            <View>
              {shuffledQuestions.map((question, index) => {
                const isInvalid = invalidQuestions.includes(question._id);

                return (
                  <View key={index}>
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

                        setSelectedAnswers(prev => ({
                          ...prev,
                          [questionId]: selectedValue,
                        }));

                        // Nếu câu hỏi này đang bị báo lỗi thì loại khỏi danh sách lỗi
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
                      {question.answerList.map((ans, idx) => {
                        const optionLetter = String.fromCharCode(65 + idx);
                        console.log(optionLetter);
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
          </>
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
            {visibleQuestion.answerList.map((ans, idx) => {
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
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
};

export default LibraryDetailItem;
