'use client';
import React, { useRef, useState } from 'react';
import { LibraryItem } from './_components';
import { FlatList, Image, Modal, View } from 'react-native-web';
import styles from './styles';
import { useAppPagination } from '@hooks';
import ReactPlayer from 'react-player';
import { Document, Page } from 'react-pdf';
import { Library } from '~mdDashboard/types';

const LibraryList = () => {
  const { listItem, fetchData, currentData } = useAppPagination<Library>({
    apiUrl: '/library/getAllLibrary',
  });

  const [selectedItem, setSelectedItem] = useState<Library>();
  const [isVisibleModalVideo, setIsVisibleModalVideo] = useState(false);
  const layoutHeight = useRef(0);
  const contentHeight = useRef(0);
  const lastFetchAt = useRef(0);
  const expectedTotal =
    currentData?.totalPages && currentData?.pageSize
      ? currentData.totalPages * currentData.pageSize
      : undefined;

  React.useEffect(() => {
    if (!expectedTotal) return;
    if (listItem.length >= expectedTotal) return;
    fetchData();
  }, [listItem.length, expectedTotal]);

  const renderModalContent = () => {
    if (!selectedItem) return null;
    switch (selectedItem.type) {
      case 'Youtube':
      case 'Video':
        return (
          <ReactPlayer
            url={selectedItem?.url}
            controls
            playing={isVisibleModalVideo}
            width="100%"
            height="100%"
          />
        );
      case 'PDF':
        return (
          <Document file={selectedItem?.url} onLoadError={console.log}>
            <Page pageNumber={1} scale={0.99} />
          </Document>
        );
      case 'Image':
        return (
          <Image
            source={selectedItem.url}
            accessibilityLabel={selectedItem.title || 'Library image preview'}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listItem}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item, index) => item._id + index}
        numColumns={4}
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 48,
          overflow: 'visible',
        }}
        columnWrapperStyle={{ gap: 16 }}
        onLayout={e => {
          layoutHeight.current = e.nativeEvent.layout.height;
        }}
        onContentSizeChange={(w, h) => {
          contentHeight.current = h;
          if (h <= layoutHeight.current && lastFetchAt.current === 0) {
            lastFetchAt.current = Date.now();
            fetchData();
          }
        }}
        renderItem={({ item }) => (
          <LibraryItem
            key={item._id}
            data={item}
            onClick={() => {
              setSelectedItem(item);
              setIsVisibleModalVideo(true);
            }}
          />
        )}
      />
      <Modal
        visible={isVisibleModalVideo}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisibleModalVideo(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000080',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          aria-label="Library detail modal"
          onClick={() => setIsVisibleModalVideo(false)}>
          <View
            style={{
              width: '80%',
              height: '80%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={e => {
              e.stopPropagation();
            }}>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LibraryList;
