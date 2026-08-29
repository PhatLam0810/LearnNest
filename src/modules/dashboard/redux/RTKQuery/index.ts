import { baseQuery } from '@redux/RTKQuery';
import {
  Category,
  GetLessonProgressParams,
  LearningInsight,
  LessonProgressResponse,
  LessonRecommendRes,
  LibraryType,
  RoadmapStep,
} from './types';
import { AxiosResponse } from 'axios';
import { Library, SelfCareItem } from '~mdDashboard/types';
import {
  PracticeCourseSummary,
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
} = dashboardQuery;
