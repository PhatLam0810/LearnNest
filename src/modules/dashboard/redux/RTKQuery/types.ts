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
