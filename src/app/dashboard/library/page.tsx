'use client';
import React, { useRef, useState } from 'react';
import { LibraryItem } from './_components';
import { FlatList, Image, Modal, View } from 'react-native-web';
import styles from './styles';
import { useAppPagination } from '@hooks';
import ReactPlayer from 'react-player';
import { Document, Page } from 'react-pdf';
import { Library } from '~mdDashboard/types';
import { useResponsive } from '@/styles/responsive';

const LibraryList = () => {
  const { listItem, fetchData, currentData } = useAppPagination<Library>({
    apiUrl: '/library/getAllLibrary',
  });

  // Responsive hook
  const { isMobile, isTablet } = useResponsive();
  const numColumns = isMobile ? 1 : isTablet ? 2 : 4;

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
    const pdfScale = isMobile ? 0.7 : isTablet ? 0.85 : 0.99;

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
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        );
      case 'PDF':
        return (
          <View
            style={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Document file={selectedItem?.url} onLoadError={console.log}>
              <Page pageNumber={1} scale={pdfScale} />
            </Document>
          </View>
        );
      case 'Image':
        return (
          <Image
            source={selectedItem.url}
            accessibilityLabel={selectedItem.title || 'Library image preview'}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            resizeMode="contain"
          />
        );
      default:
        return null;
    }
  };

  // Responsive container styles
  const containerStyle = {
    ...styles.container,
    padding: isMobile ? 12 : isTablet ? 16 : 20,
  };

  return (
    <View style={containerStyle}>
      <FlatList
        key={numColumns} // Force re-render when numColumns changes
        data={listItem}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item, index) => item._id + index}
        numColumns={numColumns}
        contentContainerStyle={{
          gap: isMobile ? 12 : 16,
          paddingBottom: 48,
          overflow: 'visible',
        }}
        columnWrapperStyle={
          numColumns > 1 ? { gap: isMobile ? 12 : 16 } : undefined
        }
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
            padding: isMobile ? 8 : 16,
          }}
          aria-label="Library detail modal"
          onClick={() => setIsVisibleModalVideo(false)}>
          <View
            style={{
              width: isMobile ? '100%' : isTablet ? '90%' : '85%',
              height: isMobile ? '75%' : isTablet ? '80%' : '85%',
              maxWidth: isMobile ? '100%' : 1200,
              maxHeight: isMobile ? '90vh' : '90vh',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: isMobile ? 8 : 12,
              overflow: 'hidden',
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
