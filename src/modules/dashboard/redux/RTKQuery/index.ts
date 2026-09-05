import { baseQuery } from '@redux/RTKQuery';
import {
  Category,
  CourseRatingItem,
  CourseRatingSummary,
  GetLessonProgressParams,
  LearningInsight,
  LessonProgressResponse,
  LessonRecommendRes,
  LibraryType,
  RoadmapStep,
  StudyStats,
} from './types';
import { AxiosResponse } from 'axios';
import { Library, SelfCareItem } from '~mdDashboard/types';
import {
  PracticeCourseSummary,
  PracticeInstructionItem,
  PracticeSubmission,
  PracticeTask,
  PracticeTaskDetail,
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
    // ĐẠT (isPass, >= 2/3 số câu) hay chưa. Dùng để khoá bài thực hành đứng
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
  useGetStudyStatsQuery,
  useGetCourseRatingQuery,
  useSubmitCourseRatingMutation,
  useGetCourseRatingsMutation,
} = dashboardQuery;
