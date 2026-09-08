import { baseQuery } from '@redux/RTKQuery';
import {
  AchievementsResponse,
  Category,
  CourseRatingItem,
  CourseRatingSummary,
  GetLessonProgressParams,
  LearningInsight,
  BookmarkItem,
  BookmarkItemType,
  LeaderboardResponse,
  LessonNote,
  LessonNoteListResponse,
  MockExamAttemptHistoryItem,
  LessonProgressResponse,
  LessonRecommendRes,
  LibraryType,
  MyOverview,
  MyQuestionListResponse,
  MyResultsParams,
  MyResultsResponse,
  NotificationListResponse,
  RetryQueueItem,
  PassRateReport,
  QuizResultAdminItem,
  RecentTestResult,
  RoadmapStep,
  StudyStats,
} from './types';
import { AxiosResponse } from 'axios';
import { Library, SelfCareItem } from '~mdDashboard/types';
import {
  MockExamAttemptDetail,
  MockExamAttemptResult,
  MockExamSummary,
  PracticeCourseSummary,
  PracticeInstructionItem,
  PracticeSubmission,
  PracticeTask,
  PracticeTaskDetail,
  WeakSkillGroup,
} from '~mdDashboard/types/practice';
import { LessonDetailDataResponse } from '../saga/type';

export const dashboardQuery = baseQuery.injectEndpoints({
  endpoints: builder => ({
    getLessonRecommend: builder.query<LessonRecommendRes, void>({
      query: () => '/lesson/recommend',
      transformResponse: (res: AxiosResponse<LessonRecommendRes>) => res.data,
    }),
    getLessonProgress: builder.query<
      LessonProgressResponse,
      GetLessonProgressParams
    >({
      query: ({ userId, subLessonId, lessonId }) => ({
        url: `/lesson/user/${userId}/sublesson/${subLessonId}/progress`,
        method: 'GET',
        params: { lessonId },
      }),
      transformResponse: (res: AxiosResponse<LessonProgressResponse>) =>
        res.data,
    }),
    getLessonId: builder.query<LessonDetailDataResponse, any>({
      query: params => ({
        url: `/lesson/${params.id}`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<LessonDetailDataResponse>) =>
        res.data,
    }),
    getLessonById: builder.mutation<LessonDetailDataResponse, any>({
      query: params => ({
        url: `/lesson/${params.id}`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<LessonDetailDataResponse>) =>
        res.data,
    }),
    getAllCategory: builder.query<Category[], void>({
      query: () => 'lesson/categories/getAll',
      transformResponse: (res: AxiosResponse<Category[]>) => res.data,
    }),
    getListLibraryType: builder.query<LibraryType[], void>({
      query: () => 'lesson/library/getListLibraryType',
      transformResponse: (res: AxiosResponse<LibraryType[]>) => res.data,
    }),
    getLibraryByType: builder.query<Library[], any>({
      query: params => ({
        url: 'lesson/library/getLibraryByType',
        method: 'GET',
        params,
      }),
      transformResponse: (res: AxiosResponse<Library[]>) => res.data,
    }),
    // getAllLibrary (danh sách) cố tình bỏ questionList để bảng nhẹ hơn -
    // trang xem trước 1 tài liệu type Text phải gọi riêng cái này để có đủ
    // câu hỏi trước khi hiện form làm bài.
    getLibraryDetail: builder.query<Library, string>({
      query: libraryId => `library/${libraryId}`,
      transformResponse: (res: AxiosResponse<Library>) => res.data,
    }),

    getTodaySelfCare: builder.query<SelfCareItem, void>({
      query: () => 'user/getTodaySelfCare',
      transformResponse: (res: AxiosResponse<SelfCareItem>) => res.data,
    }),
    markSelfCareAsRead: builder.mutation({
      query: params => ({
        url: 'user/markSelfCareAsRead',
        method: 'PUT',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    updateCurrentInfo: builder.mutation({
      query: params => ({
        url: 'user/updateCurrentInfo',
        method: 'PUT',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    setLibraryCanPlay: builder.mutation({
      query: params => ({
        url: '/library/setLibraryCanPlay',
        method: 'PUT',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    generateQuestion: builder.mutation({
      query: params => ({
        url: '/library/generate-questions',
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    checkAnswer: builder.mutation<
      { correct: boolean },
      { libraryId: string; questionId: string; answer: string }
    >({
      query: params => ({
        url: '/library/check-answer',
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    submitResultTest: builder.mutation({
      query: params => ({
        url: '/lesson/resultTest',
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getLibraryResultTest: builder.mutation({
      query: params => ({
        url: `/lesson/library/resultTest/${params.libraryId}`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    accessLesson: builder.mutation<any, { userId: string; lessonId: string }>({
      query: params => ({
        url: '/lesson/access',
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    checkRegistrationLesson: builder.mutation<
      any,
      { userId: string; lessonId: string }
    >({
      query: params => ({
        url: '/lesson/checkRegistrationLesson',
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getMyRoadmap: builder.query<LearningInsight[], string>({
      query: userId => `/ai-coach/history/${userId}`,
    }),
    adviseCourse: builder.mutation<
      {
        hasStarted: boolean;
        hasData: boolean;
        summary: string;
        roadmap?: RoadmapStep[];
        lessonId?: string;
        courseOverview?: {
          title: string;
          totalModules: number;
          totalLessons: number;
          totalDurationMinutes: number;
          modules: { title: string; lessonCount: number }[];
        };
      },
      'word' | 'excel'
    >({
      // Controller trả về object thô (không bọc trong { data: ... } như hầu
      // hết endpoint khác), giống hệt getMyRoadmap phía trên — không dùng
      // transformResponse ở đây, nếu không sẽ đọc nhầm field "data" không
      // tồn tại và trả về undefined.
      query: course => ({
        url: `/ai-coach/advise/${course}`,
        method: 'POST',
      }),
    }),
    chatWithAdvisor: builder.mutation<
      { limited: boolean; reply: string },
      string
    >({
      query: message => ({
        url: '/ai-coach/chat',
        method: 'POST',
        body: { message },
      }),
    }),

    // ---- MOS Practice Exam (học viên làm bài thực hành Word/Excel) ----
    getPracticeTasksStudent: builder.query<
      PracticeTask[],
      { subject?: 'Word' | 'Excel'; lessonId?: string } | void
    >({
      query: params => ({
        url: '/practice/tasks',
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getPracticeCourses: builder.query<PracticeCourseSummary[], void>({
      query: () => ({
        url: '/practice/tasks/courses',
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getPracticeTaskDetailStudent: builder.query<PracticeTaskDetail, string>({
      query: taskId => ({
        url: `/practice/tasks/${taskId}`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getMyPracticeSubmissions: builder.query<PracticeSubmission[], string>({
      query: taskId => ({
        url: `/practice/tasks/${taskId}/my-submissions`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    // Danh sách "Bước 1,2,3..." tự sinh cho TỪNG tiêu chí của đề — hiện cho
    // học viên xem TRƯỚC khi làm bài (đề bài "Yêu cầu 1, 2, 3..." rõ ràng
    // như đề thi MOS thật), không phải đợi nộp sai mới thấy hướng dẫn.
    getPracticeTaskInstructions: builder.query<
      PracticeInstructionItem[],
      string
    >({
      query: taskId => ({
        url: `/practice/tasks/${taskId}/instructions`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    // "Điểm yếu của bạn" - gộp lịch sử làm bài theo nhóm kỹ năng, yếu nhất
    // lên đầu. Xem PracticeSubmissionService.getMyWeakSkills (BE).
    getMyWeakSkills: builder.query<WeakSkillGroup[], void>({
      query: () => '/practice/my-weak-skills',
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    // ---- Đề thi thử (mock exam) ----
    getMockExams: builder.query<MockExamSummary[], void>({
      query: () => '/practice/mock-exams',
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    startMockExam: builder.mutation<{ _id: string }, string>({
      query: examId => ({
        url: `/practice/mock-exams/${examId}/start`,
        method: 'POST',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getMockExamAttempt: builder.query<MockExamAttemptDetail, string>({
      query: attemptId => `/practice/mock-exams/attempts/${attemptId}`,
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    submitMockExamAttempt: builder.mutation<{ status: string }, string>({
      query: attemptId => ({
        url: `/practice/mock-exams/attempts/${attemptId}/submit`,
        method: 'POST',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getMockExamResult: builder.query<MockExamAttemptResult, string>({
      query: attemptId => `/practice/mock-exams/attempts/${attemptId}/result`,
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    // Tiến độ xem TOÀN BỘ video trong 1 lesson của chính user đang đăng
    // nhập, 1 lần gọi — {[subLessonId]: đã xem xong (completed) hay chưa}.
    // Dùng để khoá bài thực hành đứng ngay sau 1 video theo đúng "đã xem
    // xong", khác hẳn "đã tới lượt xem" (usersCanPlay).
    getMyLessonVideoProgress: builder.query<
      Record<string, boolean>,
      { userId: string; lessonId: string }
    >({
      query: ({ userId, lessonId }) => ({
        url: `/lesson/user/${userId}/lesson/${lessonId}/video-progress`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    // Tương tự getMyLessonVideoProgress nhưng cho quiz — {[libraryId]: đã
    // ĐẠT (isPass, >= 80% số câu) hay chưa. Dùng để khoá bài thực hành đứng
    // ngay sau 1 quiz, xem ModuleDetailPage/LessonDetailPage.isTaskAccessible.
    getMyLessonQuizProgress: builder.query<
      Record<string, boolean>,
      { userId: string; lessonId: string }
    >({
      query: ({ userId, lessonId }) => ({
        url: `/lesson/user/${userId}/lesson/${lessonId}/quiz-progress`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    // Trang Chủ - 3 thẻ thống kê. Controller trả object thô (không bọc
    // trong {data:...}), giống getMyRoadmap - không dùng transformResponse.
    getStudyStats: builder.query<StudyStats, string>({
      query: userId => `/lesson/user/${userId}/study-stats`,
    }),

    // Trang "Tổng Quan" (/dashboard/my-courses) - giờ học 4 tuần + bài kiểm
    // tra gần đây. Cùng convention không bọc {data:...} như getStudyStats.
    getMyOverview: builder.query<MyOverview, string>({
      query: userId => `/lesson/user/${userId}/overview`,
    }),

    // Trang "Toàn bộ lịch sử kiểm tra" (/dashboard/results) - phân trang +
    // lọc theo loại/khóa học/đạt-chưa đạt.
    getMyResults: builder.query<
      MyResultsResponse,
      { userId: string } & MyResultsParams
    >({
      query: ({ userId, ...params }) => ({
        url: `/lesson/user/${userId}/results`,
        method: 'GET',
        params,
      }),
    }),

    // Dữ liệu biểu đồ "Điểm theo thời gian" cạnh "Giờ học theo tuần".
    getMyScoreHistory: builder.query<
      RecentTestResult[],
      { userId: string; limit?: number }
    >({
      query: ({ userId, limit }) => ({
        url: `/lesson/user/${userId}/score-history`,
        method: 'GET',
        params: { limit },
      }),
    }),

    // Báo cáo tỉ lệ đạt/chưa đạt theo từng bài cho admin.
    getPassRateReport: builder.query<PassRateReport, void>({
      query: () => '/lesson/admin/pass-rate-report',
    }),

    // Toàn bộ lượt làm 1 bài trắc nghiệm cho modal "Kết quả trắc nghiệm"
    // (admin) - xem lesson.service.ts getResultsForLibrary.
    getResultsForLibrary: builder.query<QuizResultAdminItem[], string>({
      query: libraryId => `/lesson/admin/library/${libraryId}/results`,
    }),

    // ---- Đánh giá khóa học ----
    getCourseRating: builder.query<CourseRatingSummary, string>({
      query: lessonId => `/lesson/${lessonId}/rating`,
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_r, _e, lessonId) => [
        { type: 'CourseRating', id: lessonId },
      ],
    }),
    submitCourseRating: builder.mutation<
      CourseRatingItem,
      { lessonId: string; stars: number; comment?: string }
    >({
      query: ({ lessonId, ...body }) => ({
        url: `/lesson/${lessonId}/rating`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, { lessonId }) => [
        { type: 'CourseRating', id: lessonId },
      ],
    }),
    getCourseRatings: builder.mutation<
      { items: CourseRatingItem[]; totalRecords: number; totalPages: number },
      { lessonId: string; pageNum?: number; pageSize?: number }
    >({
      query: ({ lessonId, ...body }) => ({
        url: `/lesson/${lessonId}/ratings`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getNotifications: builder.query<
      NotificationListResponse,
      { page?: number; limit?: number } | void
    >({
      query: params => {
        const p = params || {};
        return {
          url: '/notification',
          params: { page: p.page || 1, limit: p.limit || 20 },
        };
      },
      transformResponse: (res: AxiosResponse<NotificationListResponse>) =>
        res.data,
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation<void, string>({
      query: id => ({ url: `/notification/${id}/read`, method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: '/notification/read-all', method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),

    // ---- Ghi chú cá nhân theo mốc thời gian video ----
    getLessonNotes: builder.query<LessonNote[], string>({
      query: subLessonId => ({
        url: '/lesson-notes',
        params: { subLessonId },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_r, _e, subLessonId) => [
        { type: 'LessonNote', id: subLessonId },
      ],
    }),
    getMyLessonNotes: builder.query<
      LessonNoteListResponse,
      { pageNum?: number; pageSize?: number } | void
    >({
      query: params => {
        const p = params || {};
        return {
          url: '/lesson-notes/mine',
          params: { pageNum: p.pageNum || 1, pageSize: p.pageSize || 50 },
        };
      },
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: [{ type: 'LessonNote', id: 'MINE' }],
    }),
    createLessonNote: builder.mutation<
      LessonNote,
      {
        subLessonId: string;
        lessonId?: string;
        videoTimeSec?: number;
        content: string;
      }
    >({
      query: body => ({ url: '/lesson-notes', method: 'POST', body }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, { subLessonId }) => [
        { type: 'LessonNote', id: subLessonId },
        { type: 'LessonNote', id: 'MINE' },
      ],
    }),
    updateLessonNote: builder.mutation<
      LessonNote,
      {
        id: string;
        subLessonId: string;
        content: string;
        videoTimeSec?: number;
      }
    >({
      query: ({ id, content, videoTimeSec }) => ({
        url: `/lesson-notes/${id}`,
        method: 'PUT',
        body: { content, videoTimeSec },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, { subLessonId }) => [
        { type: 'LessonNote', id: subLessonId },
        { type: 'LessonNote', id: 'MINE' },
      ],
    }),
    deleteLessonNote: builder.mutation<
      void,
      { id: string; subLessonId: string }
    >({
      query: ({ id }) => ({ url: `/lesson-notes/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, { subLessonId }) => [
        { type: 'LessonNote', id: subLessonId },
        { type: 'LessonNote', id: 'MINE' },
      ],
    }),

    // ---- Bookmark / Đã lưu ----
    getBookmarks: builder.query<BookmarkItem[], BookmarkItemType | void>({
      query: type => ({
        url: '/bookmarks',
        params: type ? { type } : undefined,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: [{ type: 'Bookmark', id: 'LIST' }],
    }),
    getBookmarkIds: builder.query<string[], BookmarkItemType | void>({
      query: type => ({
        url: '/bookmarks/ids',
        params: type ? { type } : undefined,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: [{ type: 'Bookmark', id: 'IDS' }],
    }),
    toggleBookmark: builder.mutation<
      { bookmarked: boolean },
      { itemType: BookmarkItemType; itemId: string; lessonId?: string }
    >({
      query: body => ({ url: '/bookmarks/toggle', method: 'POST', body }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: [
        { type: 'Bookmark', id: 'LIST' },
        { type: 'Bookmark', id: 'IDS' },
      ],
    }),

    // ---- Cần làm lại (bài thực hành chưa đạt) ----
    getMyRetryQueue: builder.query<RetryQueueItem[], void>({
      query: () => '/practice/my-retry-queue',
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    // ---- Hỏi đáp của tôi ----
    getMyQuestions: builder.query<
      MyQuestionListResponse,
      { pageNum?: number; pageSize?: number } | void
    >({
      query: params => {
        const p = params || {};
        return {
          url: '/comments/mine',
          params: { pageNum: p.pageNum || 1, pageSize: p.pageSize || 30 },
        };
      },
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    // ---- Huy hiệu / thành tích ----
    getMyAchievements: builder.query<AchievementsResponse, void>({
      query: () => '/achievements/mine',
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    // ---- Bảng xếp hạng ----
    getLeaderboard: builder.query<LeaderboardResponse, number | void>({
      query: limit => ({
        url: '/practice/leaderboard',
        params: limit ? { limit } : undefined,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    // ---- Lịch sử thi thử ----
    getMyMockExamAttempts: builder.query<MockExamAttemptHistoryItem[], void>({
      query: () => '/practice/mock-exams/attempts/mine',
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetLessonProgressQuery,
  useGetMyRoadmapQuery,
  useAdviseCourseMutation,
  useChatWithAdvisorMutation,
  useGetPracticeTasksStudentQuery,
  useGetPracticeTaskDetailStudentQuery,
  useGetMyPracticeSubmissionsQuery,
  useGetPracticeCoursesQuery,
  useGetPracticeTaskInstructionsQuery,
  useGetMyWeakSkillsQuery,
  useGetMockExamsQuery,
  useStartMockExamMutation,
  useGetMockExamAttemptQuery,
  useSubmitMockExamAttemptMutation,
  useGetMockExamResultQuery,
  useGetStudyStatsQuery,
  useGetMyOverviewQuery,
  useGetMyResultsQuery,
  useGetMyScoreHistoryQuery,
  useGetPassRateReportQuery,
  useGetResultsForLibraryQuery,
  useGetCourseRatingQuery,
  useSubmitCourseRatingMutation,
  useGetCourseRatingsMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useGetLessonNotesQuery,
  useGetMyLessonNotesQuery,
  useCreateLessonNoteMutation,
  useUpdateLessonNoteMutation,
  useDeleteLessonNoteMutation,
  useGetBookmarksQuery,
  useGetBookmarkIdsQuery,
  useToggleBookmarkMutation,
  useGetMyRetryQueueQuery,
  useGetMyQuestionsQuery,
  useGetMyAchievementsQuery,
  useGetLeaderboardQuery,
  useGetMyMockExamAttemptsQuery,
} = dashboardQuery;
