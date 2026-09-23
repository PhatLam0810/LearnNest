'use client';

import React from 'react';
import { View } from 'react-native-web';
import { useResponsive } from '@/styles/responsive';
import styles from './styles';

export const CourseListSkeleton: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  const cardWidth = isMobile ? '100%' : isTablet ? '48%' : '23.8%';
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <View style={styles.container} aria-label="Đang tải danh sách khóa học">
      {items.map(key => (
        <View
          key={key}
          style={[styles.skeletonCard, { width: cardWidth as any }]}>
          <View style={styles.skeletonThumb} />
          <View style={styles.content}>
            <View style={styles.lineTitle} />
            <View style={styles.lineDesc} />
            <View style={styles.lineFooter}>
              <View style={styles.lineBadge} />
              <View style={styles.lineBadge} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default CourseListSkeleton;
