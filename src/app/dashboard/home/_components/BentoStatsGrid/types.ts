export interface BentoStatsGridProps {
  weeklyMinutes?: number;
  weeklyMinutesLastWeek?: number;
  completedLessonsCount?: number;
  retryQueueCount?: number;
  leaderboardRank?: number | null;
  unlockedAchievementsCount?: number;
  totalAchievementsCount?: number;
  loading?: boolean;
}
