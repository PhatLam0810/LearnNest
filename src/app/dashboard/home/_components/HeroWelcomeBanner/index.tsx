'use client';

import React, { useMemo } from 'react';
import { View, Text } from 'react-native-web';
import { FireOutlined, TrophyOutlined } from '@components/AppIcon';
import { asButton } from '@/utils/asButton';
import { fireConfetti } from '@/utils/confetti';
import { HeroWelcomeBannerProps } from './types';
import styles from './styles';

const INSPIRATIONAL_QUOTES = [
  'Mỗi ngày tiến bộ 1% sẽ tạo nên sự khác biệt phi thường.',
  'Hành trình vạn dặm bắt đầu từ một bài học hôm nay.',
  'Kỹ năng vững vàng - Tự tin chinh phục chứng chỉ MOS.',
  'Học tập chủ động là chìa khóa mở mọi cánh cửa tương lai.',
  'Kiên trì là con đường ngắn nhất dẫn tới thành công.',
];

const greetingByHour = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

const getLevelInfo = (xp: number) => {
  if (xp < 300) {
    return {
      level: 1,
      title: 'Tập sự VHU',
      currentXp: xp,
      nextLevelXp: 300,
      progress: Math.min(100, Math.round((xp / 300) * 100)),
    };
  }
  if (xp < 800) {
    return {
      level: 2,
      title: 'Chiến binh MOS',
      currentXp: xp - 300,
      nextLevelXp: 500,
      progress: Math.min(100, Math.round(((xp - 300) / 500) * 100)),
    };
  }
  if (xp < 1600) {
    return {
      level: 3,
      title: 'Chuyên viên Tin học',
      currentXp: xp - 800,
      nextLevelXp: 800,
      progress: Math.min(100, Math.round(((xp - 800) / 800) * 100)),
    };
  }
  return {
    level: 4,
    title: 'Bậc thầy MOS & AI',
    currentXp: xp,
    nextLevelXp: xp,
    progress: 100,
  };
};

export const HeroWelcomeBanner: React.FC<HeroWelcomeBannerProps> = ({
  fullName = 'Học viên',
  streakDays = 0,
  completedLessonsCount = 0,
  weeklyMinutes = 0,
}) => {
  const firstName = useMemo(() => {
    return fullName.trim().split(' ').slice(-1)[0] || 'Học viên';
  }, [fullName]);

  const randomQuote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return INSPIRATIONAL_QUOTES[dayOfYear % INSPIRATIONAL_QUOTES.length];
  }, []);

  // Tính toán Gamification: XP & Level
  const totalXp = useMemo(() => {
    return (
      completedLessonsCount * 100 +
      Math.round(weeklyMinutes * 1.5) +
      streakDays * 50
    );
  }, [completedLessonsCount, weeklyMinutes, streakDays]);

  const levelInfo = useMemo(() => getLevelInfo(totalXp), [totalXp]);

  // Mục tiêu học tập ngày: ví dụ 30 phút hoặc 2 bài học
  const dailyGoalPercent = useMemo(() => {
    const timeRatio = (weeklyMinutes % 60) / 30;
    return Math.min(100, Math.max(15, Math.round(timeRatio * 100)));
  }, [weeklyMinutes]);

  const isExpFull = levelInfo.progress >= 100;

  const handleCelebrate = () => {
    if (!isExpFull) return;
    fireConfetti(0.5, 0.4);
  };

  return (
    <View
      style={styles.container}
      aria-label="Hero Welcome & Gamification Banner">
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>
              {greetingByHour()}, {firstName}! 👋
            </Text>
          </View>
          <Text style={styles.quoteText}>"{randomQuote}"</Text>
        </View>

        <View style={styles.badgeRow}>
          {/* Streak Flame Badge with Morphicon */}
          <View
            style={styles.streakBadge}
            {...({
              role: 'img',
              'aria-label': `Chuỗi ngày học: ${streakDays} ngày`,
            } as object)}>
            <FireOutlined size={20} color="#ea580c" />
            <Text style={styles.streakText}>{streakDays} ngày</Text>
            <Text style={styles.streakSubText}>Streak 🔥</Text>
          </View>

          {/* Level Badge */}
          <View
            style={styles.levelBadge}
            {...({
              role: 'img',
              'aria-label': `Cấp độ ${levelInfo.level}: ${levelInfo.title}`,
            } as object)}>
            <TrophyOutlined size={18} color="var(--color-vhu-primary)" />
            <Text style={[styles.levelText, { flexShrink: 1, minWidth: 0 }]}>
              Lv.{levelInfo.level} · {levelInfo.title}
            </Text>
          </View>
        </View>
      </View>

      {/* Gamification Progress & Daily Goal */}
      <View style={styles.gamificationSection}>
        <View style={styles.gamificationHeader}>
          <View style={styles.levelInfoCol}>
            <Text style={styles.levelRankLabel}>
              Tiến trình Cấp độ {levelInfo.level}
            </Text>
            <Text style={styles.xpCountText}>
              {levelInfo.progress === 100
                ? `${totalXp} XP (Tối đa)`
                : `${levelInfo.currentXp}/${levelInfo.nextLevelXp} XP`}
            </Text>
          </View>
          <Text style={styles.xpCountText}>Tổng: {totalXp} XP tích lũy</Text>
        </View>

        <View
          style={styles.progressBarWrapper}
          {...({
            role: 'progressbar',
            'aria-label': 'Thanh tiến độ kinh nghiệm',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': levelInfo.progress,
          } as object)}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${levelInfo.progress}%` },
            ]}
          />
        </View>

        <View style={styles.dailyGoalRow}>
          <Text style={styles.dailyGoalText}>
            🎯 Mục tiêu ngày: {dailyGoalPercent}% hoàn thành (
            {Math.min(30, Math.round((dailyGoalPercent * 30) / 100))}/30 phút)
          </Text>

          <View
            style={[
              styles.celebrateBtn,
              !isExpFull && styles.celebrateBtnDisabled,
            ]}
            {...(isExpFull
              ? asButton(handleCelebrate, 'Chúc mừng hoàn thành mục tiêu')
              : { 'aria-disabled': true })}
            onClick={isExpFull ? handleCelebrate : undefined}>
            <Text
              style={[
                styles.celebrateBtnText,
                !isExpFull && styles.celebrateBtnTextDisabled,
              ]}>
              {isExpFull
                ? '🎉 Nhận thưởng / Ăn mừng'
                : '🔒 Cần đầy XP để nhận thưởng'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeroWelcomeBanner;
