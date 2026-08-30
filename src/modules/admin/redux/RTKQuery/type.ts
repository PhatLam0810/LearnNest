export interface GetCategoriesAllResponse {
  today: [];
}

export interface SetRoleParams {
  userId: string;
  role: number;
}

export interface DeleteAdminRoleParams {
  _id: string;
  roleId: string;
}

export interface CreateUserParams {
  email: string;
  phone: number;
  fullName: string;
  studentId: string;
}

export interface ImportUserItem {
  fullName: string;
  studentId: string;
  email: string;
  class?: string;
  faculty?: string;
  major?: string;
}

export interface ImportUserPreviewRequest {
  fileUrl: string;
}

export interface ImportUsersRequest {
  users: ImportUserItem[];
}

export interface ImportUsersResponse {
  successful: Array<{
    email: string;
    fullName: string;
    username: string;
    password: string;
  }>;
  failed: Array<{
    fullName: string;
    studentId: string;
    email: string;
    error: string;
  }>;
  accounts: Array<{
    email: string;
    fullName: string;
    username: string;
    password: string;
  }>;
}

export interface SendImportEmailsRequest {
  accounts: Array<{
    email: string;
    fullName: string;
    username: string;
    password: string;
  }>;
}

export interface SendImportEmailsResponse {
  successful: number;
  failed: number;
  details: Array<{
    email: string;
    status: 'fulfilled' | 'rejected';
    success: boolean;
    error: string | null;
  }>;
}

// Lesson Learners Types
export interface LessonLearnersSummary {
  _id: string;
  title: string;
  totalLearners: number;
  completedLearners?: number;
  completionRate: number;
}

export interface LessonLearnersSummaryResponse {
  totalLearners: number;
  totalRate: number;
  items: LessonLearnersSummary[];
}

export interface LessonLearner {
  _id: string;
  lessonId: string;
  isCompleted: boolean;
  isSelected?: boolean;
  firstAccessAt: string;
  fullName: string;
  email: string;
  studentId: string;
  class: string;
  major: string;
  faculty?: string;
  progress: number;
  lastStudiedAt: string | null;
  lastRemindedAt: string | null;
}

export interface RemindLearnersBulkResponse {
  totalEligible: number;
  sent: number;
  failed: number;
}

export type ReminderLogType = 'inactivity' | 'video' | 'task';

export interface ReminderLogItem {
  _id: string;
  lessonId: string;
  type: ReminderLogType;
  targetId?: string;
  targetTitle?: string;
  totalEligible: number;
  sent: number;
  failed: number;
  createdAt: string;
  triggeredByAdminId?: string;
  triggeredByAdminName?: string;
}

export interface PracticeClassItem {
  _id: string;
  lessonId?: string;
  batchName?: string;
  practiceClassName?: string;
  className?: string;
  count?: number;
  userCount?: number;
  exportedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PracticeClassListResponse {
  items: PracticeClassItem[];
  totalRecords?: number;
  pageNum?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface PracticeClassUserItem {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  status?: string;
}

export interface PracticeClassUsersResponse {
  _id?: string;
  lessonId?: string;
  batchName?: string;
  practiceClassName?: string;
  count?: number;
  exportedAt?: string;
  userIds?: string[];
  items: PracticeClassUserItem[];
  totalRecords?: number;
  pageNum?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface LessonLearnerPoolItem {
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  _id: string;
  fullName: string;
  email: string;
  studentId: string;
  class: string;
  major: string;
  faculty: string;
}

export interface LessonLearnerPoolResponse {
  lessonId: string;
  totalAvailable: number;
  items: LessonLearnerPoolItem[];
  totalRecords: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export interface CreatePracticeClassPayload {
  listUser: Array<string>;
  class: string;
  practiceClassName: string;
}

export interface CreatePracticeClassResponse {
  _id: string;
  lessonId: string;
  batchName: string;
  practiceClassName: string;
  count: number;
  exportedAt?: string;
  userIds: string[];
  users: LessonLearnerPoolItem[];
}

export interface LessonLearnersData {
  items: LessonLearner[];
  totalRecords: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

// ---- MOS Practice Exam (soạn đề Word/Excel thực hành) ----
export interface CreatePracticeTaskPayload {
  subject: 'Word' | 'Excel';
  title: string;
  description?: string;
  starterFileUrl: string;
  assetFileUrls?: string[];
  lessonId?: string;
  moduleId?: string;
  isPublished?: boolean;
}

export type UpdatePracticeTaskPayload = CreatePracticeTaskPayload;

export interface UpdatePracticeTaskParams {
  taskId: string;
  body: UpdatePracticeTaskPayload;
}

export interface PracticeCriteriaInput {
  order?: number;
  type: string;
  params: Record<string, any>;
  points?: number;
  instructionOverride?: string;
}

export interface SetPracticeCriteriaParams {
  taskId: string;
  criteria: PracticeCriteriaInput[];
}

export interface GenerateCriteriaParams {
  subject: 'Word' | 'Excel';
  title?: string;
  description: string;
}

export interface GeneratedCriterion {
  type: string;
  points: number;
  params: Record<string, any>;
}

// Tổng quan nội dung 1 khóa học theo từng Phần học (video + bài thực hành
// trộn chung) — xem AdminService.getLessonContentOverview.
export interface LessonContentOverviewVideo {
  libraryId: string;
  title: string;
  duration: number;
  completedCount: number;
  totalLearners: number;
}

export interface LessonContentOverviewTask {
  taskId: string;
  title: string;
  subject: 'Word' | 'Excel';
  passedCount: number;
  totalLearners: number;
}

export interface LessonContentOverviewModule {
  moduleId: string;
  title: string;
  videos: LessonContentOverviewVideo[];
  tasks: LessonContentOverviewTask[];
}

export interface LessonLearnersResponse {
  lessonId: string;
  lessonTitle: string;
  totalLearners: number;
  data: LessonLearnersData;
}
