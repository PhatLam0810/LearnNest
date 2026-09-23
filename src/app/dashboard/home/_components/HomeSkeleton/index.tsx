'use client';

import React from 'react';
import { View } from 'react-native-web';
import { useResponsive } from '@/styles/responsive';
import styles from './styles';

export const HomeSkeleton: React.FC = () => {
  const { isMobile } = useResponsive();

  return (
    <View style={styles.container} aria-label="Đang tải dữ liệu trang chủ...">
      {/* Hero Welcome Skeleton */}
      <View style={[styles.shimmerBase, styles.heroSkeleton]} />

      {/* Resume Card Skeleton */}
      <View style={[styles.shimmerBase, styles.resumeSkeleton]} />

      {/* Bento Grid Skeleton */}
      <View
        style={[
          styles.bentoRow,
          isMobile ? { flexDirection: 'column' as const } : null,
        ]}>
        <View style={[styles.shimmerBase, styles.bentoCardSkeleton]} />
        <View style={[styles.shimmerBase, styles.bentoCardSkeleton]} />
        <View style={[styles.shimmerBase, styles.bentoCardSkeleton]} />
        <View style={[styles.shimmerBase, styles.bentoCardSkeleton]} />
      </View>

      {/* Course List Skeleton */}
      <View
        style={[
          styles.coursesRow,
          isMobile ? { flexDirection: 'column' as const } : null,
        ]}>
        <View style={[styles.shimmerBase, styles.courseCardSkeleton]} />
        <View style={[styles.shimmerBase, styles.courseCardSkeleton]} />
        <View style={[styles.shimmerBase, styles.courseCardSkeleton]} />
      </View>
    </View>
  );
};

export default HomeSkeleton;
