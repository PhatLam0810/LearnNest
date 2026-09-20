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
  fullName: string;
  studentId: string;
  phoneNumber?: string;
  class?: string;
  faculty?: string;
  major?: string;
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

// Body thô của 3 route import: {statusCode, message, data} - statusCode nằm
// trong body chứ không phải HTTP status.
export interface ImportEnvelope<T> {
  statusCode: number;
  message: string;
  data: T | null;
}

export interface ImportUserPreviewResponse {
  statusCode: number;
  message: string;
  users: ImportUserItem[];
}

export interface ImportUsersRequest {
  users: ImportUserItem[];
  // Có classId thì BE thêm luôn các user tạo thành công vào lớp đó.
  classId?: string;
}

export interface ImportedAccount {
  email: string;
  fullName: string;
  username: string;
  password: string;
}

export interface ImportFailedRow {
  fullName: string;
  studentId: string;
  email: string;
  error: string;
}

export interface ImportUsersResponse {
  // statusCode/message nằm TRONG body (controller import luôn trả HTTP 201):
  // 201 = thành công hết, 207 = có dòng lỗi, >= 400 = cả lô bị từ chối
  // (khi đó các mảng bên dưới rỗng) - xem transformResponse importUsersBulk.
  statusCode: number;
  message: string;
  successful: ImportedAccount[];
  failed: ImportFailedRow[];
  accounts: ImportedAccount[];
  addedToClass?: number;
  classError?: string;
  // BE Pha 2: học viên đã có tài khoản sẵn (chưa tạo lại, chỉ thêm vào lớp).
  existing?: Array<{ email?: string; fullName?: string; studentId?: string }>;
  addedExisting?: number;
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
  statusCode?: number;
  message?: string;
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

export type ReminderLogType = 'inactivity' | 'video' | 'task' | 'quiz';

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

// ---- Đề thi thử (mock exam) ----
export interface CreateMockExamPayload {
  title: string;
  subject: 'Word' | 'Excel' | 'Mixed';
  durationMinutes: number;
  taskIds: string[];
  isPublished?: boolean;
}

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

export interface LessonContentOverviewQuiz {
  libraryId: string;
  title: string;
  passedCount: number;
  totalLearners: number;
}

export interface LessonContentOverviewModule {
  moduleId: string;
  title: string;
  videos: LessonContentOverviewVideo[];
  quizzes: LessonContentOverviewQuiz[];
  tasks: LessonContentOverviewTask[];
}

export interface LessonLearnersResponse {
  lessonId: string;
  lessonTitle: string;
  totalLearners: number;
  data: LessonLearnersData;
}

export interface ClassAssignmentItem {
  _id: string;
  practiceClassId: string;
  taskId: { _id: string; title: string; subject: 'Word' | 'Excel' };
  dueDate: string;
  createdAt: string;
}

export interface AssignTaskPayload {
  taskId: string;
  dueDate: string;
}

// ---- Trang "Giao Bài" (chọn 1+ lớp thuộc cùng 1 khóa, giao 1 đề) ----
export interface AssignTaskBulkPayload {
  classIds: string[];
  taskId: string;
  dueDate: string;
}

export interface AssignTaskBulkResult {
  succeeded: string[];
  failed: { classId: string; message: string }[];
}

// ---- Tạo Bài Tập (quiz trắc nghiệm nhiều đáp án đúng, TASK 4) ----
export interface QuizAnswer {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  questionText: string;
  answers: QuizAnswer[];
  explanation?: string;
  // Chỉ có ý nghĩa lúc GỬI lên BE (chèn từ ngân hàng câu hỏi) - BE dùng để
  // tăng usageCount thay vì tạo bản ghi bank mới trùng nội dung. Không có ở
  // dữ liệu đọc về từ 1 Quiz đã lưu.
  bankItemId?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  libraryId: string | { _id: string; title: string };
  questions: QuizQuestion[];
  timeLimitMinutes?: number;
  passThresholdPercent: number;
  maxAttempts?: number;
  shuffleQuestions: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizPayload {
  title: string;
  libraryId: string;
  questions: QuizQuestion[];
  timeLimitMinutes?: number;
  passThresholdPercent: number;
  maxAttempts?: number;
  shuffleQuestions: boolean;
}

export interface QuestionBankItem {
  _id: string;
  questionText: string;
  answers: QuizAnswer[];
  explanation?: string;
  libraryId?: string | { _id: string; title: string };
  usageCount: number;
  createdAt: string;
}

export interface LessonAssignmentItem {
  assignmentId: string;
  classId: string;
  className: string;
  taskId: string;
  taskTitle: string;
  subject: 'Word' | 'Excel';
  dueDate: string;
}

// ---- Xem bài nộp của học viên ----

export type SubmissionKind = 'quiz' | 'practice';
export type SubmissionState = 'passed' | 'failed' | 'ungraded';

export interface SubmissionLearner {
  _id?: string;
  fullName?: string;
  email?: string;
  studentId?: string;
  class?: string;
  avatar?: string;
}

// Hàng của danh sách bên trái - chuẩn hóa chung cho trắc nghiệm và thực hành.
export interface SubmissionListItem {
  id: string;
  learner: SubmissionLearner | null;
  submittedAt: string;
  scoreLabel: string;
  state: SubmissionState;
  isOverridden: boolean;
}

export interface QuizResultDetailQuestion {
  _id: string;
  question: string;
  answerList: string[];
  correctAnswer: string;
  selected: string | null;
  isCorrect: boolean | null;
}

export interface QuizResultDetail {
  _id: string;
  quizTitle: string;
  correctCount: number;
  totalQuestions: number;
  score: number;
  isPass: boolean;
  feedback?: string;
  createdAt: string;
  user: SubmissionLearner | null;
  hasAnswers: boolean;
  questions: QuizResultDetailQuestion[];
}

export interface PracticeSubmissionDetailResult {
  criteriaId: string;
  passed: boolean;
  detail?: string;
  instruction?: string;
  type: string | null;
  points: number | null;
}

export interface PracticeSubmissionDetail {
  _id: string;
  fileUrl: string;
  submittedAt: string;
  totalScore: number;
  maxScore: number;
  aiSummary?: string;
  autoScore?: number;
  overrideComment?: string;
  overriddenAt?: string;
  user: SubmissionLearner | null;
  task: { _id: string; title: string; subject: 'Word' | 'Excel' } | null;
  results: PracticeSubmissionDetailResult[];
}

export interface OverridePracticePayload {
  id: string;
  score: number;
  comment?: string;
}

export interface RegradeTaskResult {
  regraded: number;
  failed: number;
}

// ---- Quản lý lớp thực hành ----

export interface ClassOverviewAssignment {
  id: string;
  taskId: string;
  taskTitle: string;
  subject: string;
  dueDate: string;
}

export interface ClassOverviewItem {
  _id: string;
  code: string;
  name: string;
  lessonTitle: string;
  memberCount: number;
  assignmentCount: number;
  assignment: ClassOverviewAssignment | null;
  submittedCount: number;
}

export type ClassLearnerState = 'not_submitted' | 'passed' | 'failed';

export interface ClassRosterLearner {
  user: SubmissionLearner & { _id: string };
  state: ClassLearnerState;
  totalScore: number | null;
  maxScore: number | null;
  submittedAt: string | null;
}

export interface ClassRoster {
  class: { _id: string; code: string; name: string };
  assignments: ClassOverviewAssignment[];
  assignment: ClassOverviewAssignment | null;
  learners: ClassRosterLearner[];
}

export interface CreateClassWithAssignmentPayload {
  class: string;
  practiceClassName?: string;
  taskId: string;
  dueDate: string;
  userIds?: string[];
  classCode?: string;
}

export interface RemindClassResult {
  reminded: number;
  total: number;
}

export interface SelectableUser {
  _id: string;
  fullName?: string;
  email?: string;
  studentId?: string;
  class?: string;
}

export interface ClassCodeOption {
  _id: string;
  name: string;
}

// ---- "Lớp học" (GET/POST/PUT /admin/classes) ----

export type ClassStatusValue = 'active' | 'archived';

export interface ClassItem {
  _id: string;
  code: string;
  name: string;
  termLabel: string;
  note: string;
  status: ClassStatusValue;
  memberCount: number;
  courseCount: number;
  // Tên các khóa được phân (chỉ có ở danh sách lớp).
  courseTitles?: string[];
  // Lớp cũ gắn 1 khóa qua lessonId, lớp mới tạo chưa gắn khóa = null.
  lessonId: string | null;
  createdAt: string;
}

export interface ClassListParams {
  status?: ClassStatusValue;
  search?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface ClassListResponse {
  items: ClassItem[];
  totalRecords: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateClassBody {
  code: string;
  name: string;
  termLabel?: string;
  note?: string;
}

// Mã lớp không đổi được; termLabel/note chuỗi rỗng = xóa giá trị.
export interface UpdateClassBody {
  name?: string;
  termLabel?: string;
  note?: string;
  status?: ClassStatusValue;
}

export interface ClassMember {
  _id: string;
  fullName?: string;
  email?: string;
  studentId?: string;
  class?: string;
  major?: string;
  faculty?: string;
}

export interface ClassMembersParams {
  classId: string;
  search?: string;
  pageNum: number;
  pageSize: number;
}

export interface ClassMembersResponse {
  items: ClassMember[];
  totalRecords: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export interface MoveClassMembersResult {
  moved: number;
  skipped: number;
  fromCount: number;
  toCount: number;
}

// ---- Báo cáo vi phạm bình luận ----

export type CommentReportStatus = 'pending' | 'resolved' | 'dismissed';
export type CommentReportReason =
  'spam' | 'inappropriate' | 'misinformation' | 'other';

export interface CommentReportUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
}

export interface CommentReportComment {
  _id: string;
  commentText: string;
  images?: string[];
  user?: CommentReportUser;
  createdAt: string;
  contextTitle?: string;
  link?: string;
}

export interface CommentReportItem {
  _id: string;
  commentId: CommentReportComment | null;
  reportedBy: CommentReportUser | null;
  reason: CommentReportReason;
  note?: string;
  status: CommentReportStatus;
  warnedAt?: string;
  createdAt: string;
}

export interface CommentReportList {
  items: CommentReportItem[];
  totalRecords: number;
  pageNum: number;
  pageSize: number;
}

// Khóa học được phân cho lớp (BE admin/classes/:classId/courses).
export interface ClassCourseItem {
  classId: string;
  lessonId: string;
  title: string;
  thumbnail: string;
  accessMode: 'public' | 'class';
  startAt: string | null;
  endAt: string | null;
  // 'legacy' = lớp thực hành cũ chỉ có lessonId (chưa migrate sang ClassCourse).
  source: 'class' | 'legacy';
}

export interface AssignClassCourseBody {
  lessonId: string;
  // null = xóa mốc đã đặt; bỏ trống = giữ nguyên.
  startAt?: string | null;
  endAt?: string | null;
}

export type ClassProgressStatus = 'notStarted' | 'inProgress' | 'done';

export interface ClassProgressRow {
  userId: string;
  fullName: string;
  email: string;
  studentId: string;
  totalItems: number;
  doneItems: number;
  percent: number;
  bestQuizScore: number | null;
  lastActiveAt: string | null;
  status: ClassProgressStatus;
}

export interface ClassProgressResponse {
  items: ClassProgressRow[];
  summary: {
    total: number;
    notStarted: number;
    inProgress: number;
    done: number;
  };
}

export interface RemindLearningResult {
  dryRun: boolean;
  candidates: number;
  sent: number;
  skipped: { userId: string; fullName: string; reason: string }[];
}

// Tab "Tổng quan" của quản trị (BE GET admin/overview).
export interface OverviewSignupDay {
  date: string;
  student: number;
  guest: number;
}

export interface OverviewAtRiskLearner {
  userId: string;
  lessonId: string | null;
  fullName: string;
  email: string;
  className: string;
  lastActiveAt: string | null;
  daysInactive: number | null;
}

export interface OverviewDeadline {
  assignmentId: string;
  classId: string;
  className: string;
  taskTitle: string;
  dueDate: string;
  submitted: number;
  total: number;
}

export interface AdminOverview {
  signups: {
    total: number;
    student: number;
    guest: number;
    days: OverviewSignupDay[];
  };
  completion: { rate: number; deltaVsLastMonth: number | null };
  atRiskCount: number;
  atRisk: OverviewAtRiskLearner[];
  dueSoon: number;
  deadlines: OverviewDeadline[];
  weekly: {
    activeLearners: number;
    newSubmissions: number;
    newClasses: number;
    pendingFeedback: number;
  };
}
