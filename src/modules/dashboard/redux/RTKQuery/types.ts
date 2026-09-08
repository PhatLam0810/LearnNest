export interface LessonRecommendRes {
  today: Today;
  recommend: Recommend[];
  popularCategories: Category[];
}

export interface Today {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  learnedSkills: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
  isPremium: boolean;
  price: number;
  __v: number;
}

export interface Recommend {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  learnedSkills: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
  isPremium: boolean;
  price: number;
  averageRating?: number;
  ratingCount?: number;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LibraryType {
  _id: string;
  name: string;
  filter?: {
    collection: string;
    query?: any;
  };
  __v: number;
}
export interface LessonProgressResponse {
  lastPosition: number;
  progress: number;
  completed: boolean;
  duration: number;
  subLessonId?: string;
}
export interface GetLessonProgressParams {
  userId: string;
  subLessonId: string;
  lessonId?: string;
}

export interface RoadmapStep {
  lessonName: string;
  action: string;
  suggestedDeadline?: string;
}

export interface AnalyzedCourse {
  lessonId: string;
  lessonName: string;
  progress: number;
  daysSinceLastWatched: number;
}

export interface LearningInsight {
  _id: string;
  generatedAt: string;
  coursesAnalyzed: AnalyzedCourse[];
  summary: string;
  roadmap: RoadmapStep[];
  reminderSubject: string;
  reminderBody: string;
  emailSent: boolean;
}

// Trang Chủ - 3 thẻ thống kê (giờ học tuần này, bài đã hoàn thành, chuỗi
// ngày học). Xem LessonService.getStudyStats (BE).
export interface StudyStats {
  weeklyMinutes: number;
  weeklyMinutesLastWeek: number;
  completedLessonsCount: number;
  streakDays: number;
}

// Trang "Tổng Quan" (/dashboard/my-courses). Xem LessonService.getMyOverview
// (BE).
export interface WeeklyStudyHour {
  label: string;
  hours: number;
}

export interface RecentTestResult {
  _id: string;
  name: string;
  score: number;
  isPass: boolean;
  createdAt: string;
  // 'mock_exam' - 1 dòng TỔNG cho cả đề thi thử đã nộp/hết giờ (không phải
  // từng bài lẻ trong đề) - xem LessonService.getMergedResults (BE).
  type: 'quiz' | 'practice' | 'mock_exam';
  // Đường dẫn để làm lại bài này - null nếu không tra được (VD library mồ
  // côi, không gắn module nào). Xem LessonService.getMergedResults (BE).
  lessonId: string | null;
  link: string | null;
}

export interface MyOverview {
  weeklyHours: WeeklyStudyHour[];
  totalHours: number;
  recentResults: RecentTestResult[];
}

// Trang "Toàn bộ lịch sử kiểm tra" (/dashboard/results). Xem
// LessonService.getMyResults (BE).
export interface MyResultsResponse {
  items: RecentTestResult[];
  total: number;
  page: number;
  limit: number;
}

export interface MyResultsParams {
  page?: number;
  limit?: number;
  type?: 'quiz' | 'practice' | 'mock_exam';
  isPass?: boolean;
  lessonId?: string;
}

// Báo cáo tỉ lệ đạt/chưa đạt cho admin. Xem LessonService.getPassRateReport
// (BE).
export interface PassRateReportRow {
  id: string;
  name: string;
  type: 'quiz' | 'practice';
  attempts: number;
  passCount: number;
  passRate: number;
  avgScore: number;
}

export interface PassRateReport {
  rows: PassRateReportRow[];
  summary: {
    totalAttempts: number;
    overallPassRate: number;
    currentThresholdPct: number;
  };
}

// 1 lượt làm bài trắc nghiệm, cho modal "Kết quả trắc nghiệm" (admin). Xem
// LessonService.getResultsForLibrary (BE) - `user` là null nếu không tra
// được (dữ liệu rác/tài khoản đã xoá).
export interface QuizResultAdminItem {
  _id: string;
  libraryId: string;
  userId: string;
  userName: string;
  name: string;
  correctCount: number;
  totalQuestions: number;
  score: number;
  isPass: boolean;
  createdAt: string;
  user: {
    _id: string;
    fullName?: string;
    email?: string;
    studentId?: string;
    class?: string;
  } | null;
}

export interface CourseRatingUser {
  _id: string;
  fullName?: string;
  avatar?: string;
}

export interface CourseRatingItem {
  _id: string;
  lessonId: string;
  userId: string | CourseRatingUser;
  stars: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseRatingSummary {
  averageRating: number;
  ratingCount: number;
  myRating: CourseRatingItem | null;
  breakdown?: Record<'5' | '4' | '3' | '2' | '1', number>;
}

// Thông báo chuông trên HeaderLayout - dùng chung cho học viên lẫn admin,
// chỉ khác `type`/nội dung theo vai trò người nhận. Xem BE
// notification.schema.ts.
export type NotificationType =
  | 'COMMENT_REPLY'
  | 'NEW_QUESTION'
  | 'FEEDBACK_REPLIED'
  | 'VIOLATION_REPORT'
  | 'NEW_COURSE'
  | 'COURSE_COMPLETED'
  | 'STUDY_REMINDER'
  | 'RETRY_REMINDER';

export interface NotificationItem {
  _id: string;
  recipientId: string;
  actorId?: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  unreadCount: number;
  hasMore: boolean;
  total: number;
}

// ---- Ghi chú cá nhân theo mốc thời gian video ----
export interface LessonNote {
  _id: string;
  userId: string;
  // Khi lấy qua /lesson-notes/mine, subLessonId được populate thành object
  // { _id, title, type }; khi lấy theo bài học thì vẫn là string id.
  subLessonId: string | { _id: string; title: string; type: string };
  lessonId?: string;
  videoTimeSec: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonNoteListResponse {
  items: LessonNote[];
  totalRecords: number;
  totalPages: number;
  pageNum: number;
  pageSize: number;
}

// ---- Bookmark / Đã lưu ----
export type BookmarkItemType =
  'sublesson' | 'library' | 'practiceTask' | 'lesson';

export interface BookmarkItem {
  _id: string;
  itemType: BookmarkItemType;
  itemId: string;
  lessonId?: string;
  title: string;
  subject?: string;
  link: string;
  createdAt: string;
}
