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
import { Modal } from 'antd';

type LibraryDetailItemProps = {
  data: Library;
  onWatchFinish?: () => void;
};

const LibraryDetailItem: React.FC<LibraryDetailItemProps> = ({
  data,
  onWatchFinish,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  const playerRef = useRef(null);
  const [lastPlayed, setLastPlayed] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);
  const [apiCalled, setApiCalled] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const getYoutubeId = url => {
    const match = url.match(/(?:[?&]v=|youtu\.be\/|embed\/)([^&]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const percentWatched = (maxWatched / duration) * 100;
        if (currentTime > maxWatched + 5) {
          warning();
          playerRef.current.pauseVideo();
          playerRef.current.seekTo(lastPlayed);
        } else {
          setLastPlayed(currentTime);
          setMaxWatched(prevMax => Math.max(prevMax, currentTime));
        }
        if (percentWatched >= 99) {
          onWatchFinish();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastPlayed, data]);

  const warning = () => {
    modal.warning({
      title: 'Warning',
      content:
        'You are learning faster than usual, please avoid skipping too much while studying!',
      centered: true,
    });
  };

  const renderMedia = () => {
    switch (data.type) {
      case 'Video':
      case 'Youtube':
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
            <View
              onClick={() => setModalVisible(true)}
              style={styles.fullscreenButton}>
              <FullscreenOutlined />
            </View>
          </View>
        );
      case 'Text':
        return (
          <div
            style={styles.text}
            dangerouslySetInnerHTML={{ __html: data.url }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View>
      {renderMedia()}
      {contextHolder}
    </View>
  );
};

export default LibraryDetailItem;
