'use client';
import React, { useState } from 'react';
import { Image, Modal, View } from 'react-native-web';
import { Document, Page } from 'react-pdf';
import { FullscreenOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
import { Library } from '~mdDashboard/types';
import styles from './styles';
import { handleConvert } from './functions';
import NextImage from 'next/image';

type LibraryDetailItemProps = {
  data: Library;
};

const LibraryDetailItem: React.FC<LibraryDetailItemProps> = ({ data }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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
              <ReactPlayer width="100%" height="100%" controls url={data.url} />
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
              <ReactPlayer width="100%" height="100%" controls url={data.url} />
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
      <Modal
        visible={isModalVisible}
        transparent
        onClick={() => setModalVisible(false)}>
        <View style={styles.modalBackground} onClick={e => e.stopPropagation()}>
          <Document file={data.url}>
            <Page pageNumber={1} scale={0.99} />
          </Document>
        </View>
      </Modal>
    </View>
  );
};

export default LibraryDetailItem;
