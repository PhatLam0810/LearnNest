'use client';
import { asButton } from '@/utils/asButton';
import React from 'react';
import { Card } from 'antd';
import {
  BookOutlined,
  PlayCircleOutlined,
  StarFilled,
  TeamOutlined,
} from '@components/AppIcon';
import './styles.css';
import styles from './styles';
import { Text, View } from 'react-native-web';
import LessonThumbnail from '../LessonThumbnail';
import BookmarkButton from '@components/BookmarkButton';
import { usePremium } from '@/modules/premium/usePremium';

type LessonItemData = {
  thumbnail: string;
  title: string;
  description: string;
  _id: string;
  isPremium: boolean;
  price: number;
  totalLibraries?: number;
  totalLearners?: number;
  averageRating?: number;
  ratingCount?: number;
  isInProgress?: boolean;
};

type LessonItemProps = {
  data: LessonItemData;
  onClick: () => void;
  onEditClick?: (data: any) => void;
  refresh?: () => void;
  haveMenu?: boolean;
  style?: any;
  // Trạng thái "đã lưu" - trang cha suy từ getBookmarkIds('lesson'). Không
  // truyền = ẩn nút bookmark (vd chỗ dùng lại LessonItem cho admin).
  bookmarked?: boolean;
  showBookmark?: boolean;
};

const LessonItem: React.FC<LessonItemProps> = ({
  data,
  onClick,
  style,
  bookmarked,
  showBookmark,
}) => {
  const {
    thumbnail,
    title,
    description,
    isPremium,
    totalLibraries,
    totalLearners,
    averageRating,
    ratingCount,
    isInProgress,
  } = data || {};
  const { isPremium: userIsPremium } = usePremium();
  // Khóa Premium mà tài khoản chưa Premium: chỉ hiển thị nhãn, BE mới chặn thật.
  const premiumLocked = !!isPremium && !userIsPremium;

  return (
    <Card
      className="lesson-card"
      styles={{ body: { display: 'flex', height: '100%' } }}
      hoverable
      style={Object.assign({}, styles.container, style)}>
      {showBookmark && data?._id && (
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 999,
            padding: 4,
            lineHeight: 1,
          }}>
          <BookmarkButton
            itemType="lesson"
            itemId={data._id}
            bookmarked={bookmarked}
            size={18}
          />
        </View>
      )}
      <View
        style={styles.inner}
        {...asButton(onClick, data.title)}
        onClick={onClick}>
        {premiumLocked && (
          <View style={styles.premium}>
            <StarFilled style={styles.premiumIcon} />
          </View>
        )}

        <View style={styles.cardThumbnail}>
          <LessonThumbnail thumbnail={thumbnail} />
          {isInProgress && (
            <View style={styles.inProgressBadge}>
              <Text style={styles.inProgressBadgeText}>Đang học</Text>
            </View>
          )}
        </View>

        <View style={[styles.content, { flex: 1 }]}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {description}
          </Text>
          {premiumLocked && <Text style={styles.price}>Premium</Text>}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BookOutlined style={styles.statIcon} />
              <Text style={styles.statValue}>{totalLibraries}</Text>
            </View>
            <View style={styles.statItem}>
              <TeamOutlined style={styles.statIcon} />
              <Text style={styles.statValue}>{totalLearners}</Text>
            </View>
            {!!ratingCount && (
              <View style={styles.statItem}>
                <StarFilled
                  style={{ ...styles.statIcon, ...styles.ratingStarIcon }}
                />
                <Text style={styles.statValue}>
                  {averageRating?.toFixed(1)} ({ratingCount})
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionRow}>
            <View style={styles.enterBtn}>
              <PlayCircleOutlined size={14} color="var(--color-vhu-primary)" />
              <Text style={styles.enterBtnText}>
                {isInProgress ? 'Học tiếp' : 'Vào học'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default LessonItem;
