'use client';
import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, Text, View } from 'react-native-web';
import { Modal as AntdModal } from 'antd';
import {
  CloseOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  PictureOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import styles from './styles';
import AppButton from '@components/AppButton';
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

// Nhãn + icon theo loại nội dung — dùng cho header modal xem trước lẫn cột
// "Loại" trên bảng danh sách.
const TYPE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  Video: { label: 'Video', icon: <PlayCircleOutlined /> },
  Youtube: { label: 'Video', icon: <PlayCircleOutlined /> },
  PDF: { label: 'Tài liệu PDF', icon: <FilePdfOutlined /> },
  Text: { label: 'Bài tập ôn tập', icon: <FileTextOutlined /> },
  Image: { label: 'Hình ảnh', icon: <PictureOutlined /> },
};

// Các pill lọc theo loại nội dung thật (Library.type) — không dùng
// LibraryType (bảng riêng, hiện chưa có dữ liệu seed nào trong DB).
const TYPE_FILTERS: { key: string; label: string; filter?: any }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pdf', label: 'PDF', filter: { type: 'PDF' } },
  { key: 'exercise', label: 'Bài tập', filter: { type: 'Text' } },
  {
    key: 'recorded',
    label: 'Ghi hình lớp học',
    filter: { type: { $in: ['Video', 'Youtube'] } },
  },
];

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('vi-VN');
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
  headerIcon: {
    fontSize: 18,
    color: 'var(--color-vhu-primary)',
    display: 'flex',
  } as const,
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  } as const,
  badge: {
    fontSize: 12,
    color: 'var(--color-vhu-primary)',
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    padding: '2px 10px',
    whiteSpace: 'nowrap',
  } as const,
  closeBtn: {
    width: 32,
    height: 32,
    minWidth: 32,
    padding: 0,
    borderRadius: 8,
    border: 'none',
    background: '#f3f4f6',
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
  const { listItem, fetchData, changeParams, currentData } =
    useAppPagination<Library>({
      apiUrl: '/library/getAllLibrary',
    });

  const { isMobile, isTablet } = useResponsive();
  const { keyword, sortBy } = useSearchContext();
  const [activeType, setActiveType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Library>();
  const [open, setOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const userProfile = useAppSelector(
    (s: any) => s.authReducer?.tokenInfo?.userProfile,
  );
  const [submitResultTest] = dashboardQuery.useSubmitResultTestMutation();

  useEffect(() => {
    const filter = TYPE_FILTERS.find(t => t.key === activeType)?.filter;
    changeParams({ search: keyword, sortBy, filter });
  }, [keyword, sortBy, activeType]);

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
  const hasMore = !!currentData && currentData.pageNum < currentData.totalPages;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Thư Viện</Text>
        <Text style={styles.pageSubtitle}>
          {currentData?.totalRecords ?? listItem.length} tài liệu
        </Text>
      </View>

      <View style={styles.filterRow}>
        {TYPE_FILTERS.map(f => (
          <View
            key={f.key}
            onClick={() => setActiveType(f.key)}
            style={
              activeType === f.key ? styles.filterPillActive : styles.filterPill
            }>
            <Text
              style={
                activeType === f.key
                  ? styles.filterPillTextActive
                  : styles.filterPillText
              }>
              {f.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.table}>
        {!isMobile && (
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colDoc]}>
              Tài liệu
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colType]}>Loại</Text>
            <Text style={[styles.tableHeaderCell, styles.colDate]}>
              Cập nhật
            </Text>
          </View>
        )}
        <ScrollView>
          {listItem.map(item => {
            const itemMeta = TYPE_META[item.type];
            return (
              <View
                key={item._id}
                onClick={() => openItem(item)}
                style={styles.tableRow}>
                <View style={[styles.tableCell, styles.colDoc]}>
                  <span style={styles.rowIcon}>{itemMeta?.icon}</span>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                {!isMobile && (
                  <View style={[styles.tableCell, styles.colType]}>
                    <Text style={styles.typeBadge}>
                      {itemMeta?.label || item.type}
                    </Text>
                  </View>
                )}
                <View style={[styles.tableCell, styles.colDate]}>
                  <Text style={styles.rowDate}>
                    {formatDate(item.updatedAt)}
                  </Text>
                </View>
              </View>
            );
          })}
          {hasMore && (
            <View style={styles.loadMoreWrap}>
              <AppButton style={{ width: 'auto' }} onClick={() => fetchData()}>
                Xem thêm
              </AppButton>
            </View>
          )}
        </ScrollView>
      </View>

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
              <AppButton
                shape="circle"
                icon={<CloseOutlined />}
                onClick={closeModal}
                aria-label="Đóng"
                style={sx.closeBtn}
              />
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
          <AppButton
            key="close"
            style={{
              width: 'auto',
              backgroundColor: 'var(--color-vhu-primary)',
              borderColor: 'var(--color-vhu-primary)',
              color: '#fff',
            }}
            onClick={() => setQuizResult(null)}>
            Đóng
          </AppButton>,
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
