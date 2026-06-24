import { baseQuery } from '@redux/RTKQuery';
import {
  Category,
  GetLessonProgressParams,
  LessonProgressResponse,
  LessonRecommendRes,
  LibraryType,
} from './types';
import { AxiosResponse } from 'axios';
import { Library, SelfCareItem } from '~mdDashboard/types';
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
    getLessonId: builder.mutation<LessonDetailDataResponse, any>({
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
  }),
  overrideExisting: true,
});
export const { useGetLessonProgressQuery } = dashboardQuery;
