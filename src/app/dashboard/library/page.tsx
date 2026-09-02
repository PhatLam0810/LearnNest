'use client';
import React, { useEffect, useRef, useState } from 'react';
import { LibraryItem } from './_components';
import { FlatList, Image, Modal, Text, View } from 'react-native-web';
import { Modal as AntdModal, Button } from 'antd';
import {
  CloseOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  PictureOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import styles from './styles';
import { useAppPagination } from '@hooks';
import { messageApi } from '@hooks';
import ReactPlayer from 'react-player';
import { Library } from '~mdDashboard/types';
import PdfLessonViewer from '~mdDashboard/components/PdfLessonViewer';
import LibraryDetailItem from '~mdDashboard/components/LibraryDetailItem';
import { dashboardQuery } from '~mdDashboard/redux';
import { useAppSelector } from '@redux';
import { useResponsive } from '@/styles/responsive';
import { useSearchContext } from '@components/SearchContext';

// Nhãn + icon theo loại nội dung — dùng cho header modal xem trước.
const TYPE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  Video: { label: 'Video', icon: <PlayCircleOutlined /> },
  Youtube: { label: 'Video', icon: <PlayCircleOutlined /> },
  PDF: { label: 'Tài liệu PDF', icon: <FilePdfOutlined /> },
  Text: { label: 'Bài tập ôn tập', icon: <FileTextOutlined /> },
  Image: { label: 'Hình ảnh', icon: <PictureOutlined /> },
};

const sx = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  } as const,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 12,
  } as const,
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  } as const,
  headerIcon: { fontSize: 18, color: '#2563eb', display: 'flex' } as const,
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  } as const,
  badge: {
    fontSize: 12,
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    padding: '2px 10px',
    whiteSpace: 'nowrap',
  } as const,
  closeBtn: {
    border: 'none',
    background: '#f3f4f6',
    borderRadius: 8,
    width: 32,
    height: 32,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#374151',
    fontSize: 14,
  } as const,
  body: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } as const,
};

const LibraryList = () => {
  const { listItem, fetchData, changeParams } = useAppPagination<Library>({
    apiUrl: '/library/getAllLibrary',
  });

  const { isMobile, isTablet } = useResponsive();
  const numColumns = isMobile ? 1 : isTablet ? 2 : 4;
  const { keyword, sortBy } = useSearchContext();
  const [selectedItem, setSelectedItem] = useState<Library>();
  const [open, setOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const userProfile = useAppSelector(
    (s: any) => s.authReducer?.tokenInfo?.userProfile,
  );
  const [submitResultTest] = dashboardQuery.useSubmitResultTestMutation();

  const layoutHeight = useRef(0);
  const contentHeight = useRef(0);
  const lastFetchAt = useRef(0);

  useEffect(() => {
    fetchData();
  }, []); // Chỉ gọi 1 lần khi load trang

  useEffect(() => {
    changeParams({ search: keyword, sortBy });
  }, [keyword, sortBy]);

  const openItem = (item: Library) => {
    setSelectedItem(item);
    setQuizResult(null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setQuizResult(null);
  };

  const handleQuizSubmit = async (selectedAnswers: Record<string, string>) => {
    if (!selectedItem) return;
    try {
      const res: any = await submitResultTest({
        userId: userProfile?._id,
        libraryId: selectedItem._id,
        name: selectedItem.title,
        userName: userProfile?.fullName,
        selectedAnswers,
      }).unwrap();
      setQuizResult(res);
    } catch {
      messageApi.error('Nộp bài thất bại, vui lòng thử lại.');
    }
  };

  const renderModalContent = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'Youtube':
      case 'Video':
        return (
          <ReactPlayer
            url={selectedItem?.url}
            controls
            playing={open}
            width="100%"
            height="100%"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        );
      case 'PDF':
        return <PdfLessonViewer data={selectedItem} />;
      case 'Text':
        return (
          <View style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <LibraryDetailItem
              key={selectedItem._id}
              data={selectedItem}
              dataQuestion={selectedItem.questionList}
              onClickSubmit={handleQuizSubmit}
            />
          </View>
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
        return (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}>
            <Text style={{ color: '#6b7280' }}>
              Loại nội dung này chưa hỗ trợ xem trước.
            </Text>
          </View>
        );
    }
  };

  const meta = selectedItem ? TYPE_META[selectedItem.type] : undefined;

  return (
    <View style={styles.container}>
      <FlatList
        key={numColumns} // Force re-render when numColumns changes
        data={listItem}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item, index) => item._id + index}
        numColumns={numColumns}
        contentContainerStyle={{
          gap: isMobile ? 12 : 16,
          paddingBottom: 48,
          padding: 20,
          overflow: 'visible',
        }}
        columnWrapperStyle={
          numColumns > 1 ? { gap: isMobile ? 12 : 16 } : undefined
        }
        onLayout={e => {
          layoutHeight.current = e.nativeEvent.layout.height;
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchData();
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
            onClick={() => openItem(item)}
          />
        )}
      />

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <View
          style={{ ...sx.overlay, padding: isMobile ? 8 : 16 }}
          aria-label="Library detail modal"
          onClick={closeModal}>
          <View
            style={{
              width: isMobile ? '100%' : isTablet ? '92%' : '86%',
              height: isMobile ? '82%' : '88%',
              maxWidth: 1200,
              maxHeight: '92vh',
              backgroundColor: '#fff',
              borderRadius: isMobile ? 10 : 16,
              overflow: 'hidden',
              boxShadow: '0 24px 70px rgba(0,0,0,0.35)',
            }}
            onClick={(e: any) => e.stopPropagation()}>
            <View style={sx.header}>
              <View style={sx.headerLeft}>
                <span style={sx.headerIcon}>{meta?.icon}</span>
                <Text numberOfLines={1} style={sx.headerTitle}>
                  {selectedItem?.title || 'Nội dung'}
                </Text>
                {meta ? <span style={sx.badge}>{meta.label}</span> : null}
              </View>
              <button
                type="button"
                style={sx.closeBtn}
                onClick={closeModal}
                aria-label="Đóng">
                <CloseOutlined />
              </button>
            </View>

            <View style={sx.body}>{renderModalContent()}</View>
          </View>
        </View>
      </Modal>

      <AntdModal
        open={!!quizResult}
        centered
        onCancel={() => setQuizResult(null)}
        title={
          quizResult?.isPass ? 'Hoàn thành bài tập 🎉' : 'Chưa đạt, thử lại nhé'
        }
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setQuizResult(null)}>
            Đóng
          </Button>,
        ]}>
        {quizResult ? (
          <View style={{ gap: 8 }}>
            <Text>
              Đúng <b>{quizResult.correctCount}</b>/{quizResult.totalQuestions}{' '}
              câu
            </Text>
            <Text>
              Điểm: <b>{quizResult.score}</b>
            </Text>
            {quizResult.feedback ? (
              <Text style={{ color: '#6b7280', whiteSpace: 'pre-wrap' }}>
                {quizResult.feedback}
              </Text>
            ) : null}
          </View>
        ) : null}
      </AntdModal>
    </View>
  );
};

export default LibraryList;
