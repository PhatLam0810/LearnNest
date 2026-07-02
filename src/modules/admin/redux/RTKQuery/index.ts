import { baseQuery } from '@redux/RTKQuery';
import { AxiosResponse } from 'axios';
import { LibraryType } from '~mdDashboard/redux/RTKQuery/types';
import { Category } from '~mdDashboard/redux/saga/type';
import {
  CreateUserParams,
  DeleteAdminRoleParams,
  ImportUserItem,
  ImportUserPreviewRequest,
  ImportUsersRequest,
  ImportUsersResponse,
  CreatePracticeClassPayload,
  CreatePracticeClassResponse,
  LessonLearnerPoolResponse,
  LessonLearnersResponse,
  LessonLearnersSummaryResponse,
  PracticeClassListResponse,
  PracticeClassUsersResponse,
  SendImportEmailsRequest,
  SendImportEmailsResponse,
  SetRoleParams,
} from './type';

export const adminQuery = baseQuery.injectEndpoints({
  endpoints: builder => ({
    getCategoriesAll: builder.query<Category[], void>({
      query: () => '/lesson/categories/getAll',
      transformResponse: (res: AxiosResponse<Category[]>) => res.data,
    }),

    addLibrary: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'library',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    addModule: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson/addModule',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    addLesson: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    updateLesson: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson',
        method: 'PUT',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    deleteLibrary: builder.mutation({
      query: (params: { _id: string }) => ({
        url: 'library',
        method: 'DELETE',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    deleteModule: builder.mutation({
      query: (params: { _id: string }) => ({
        url: `/lesson/module/${params._id}`,
        method: 'DELETE',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    deleteLesson: builder.mutation({
      query: (params: { _id: string }) => ({
        url: `/lesson/${params._id}`,
        method: 'DELETE',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    bulkLibraryFromYoutube: builder.mutation<any, void>({
      query: (body: any) => ({
        url: '/lesson/bulkLibraryFromYoutube',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    bulkLibraryFromGoogleDrive: builder.mutation<any, void>({
      query: (body: any) => ({
        url: '/library/bulkFromGoogleDrive',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getListLibraryType: builder.query<LibraryType[], void>({
      query: (params: any) => ({
        url: 'lesson/library/getListLibraryType',
        method: 'GET',
        params,
      }),
      transformResponse: (res: AxiosResponse<LibraryType[]>) => {
        const data = res.data;
        data.shift();
        return data;
      },
    }),
    addLibraryType: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson/library/addLibraryType',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    getListTagFirstPage: builder.query<any, void>({
      query: (body: any) => ({
        url: 'tag/getAll',
        method: 'POST',
        body: { search: body.search },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    addNewTag: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'tag',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    getUserInfoById: builder.mutation({
      query: (params: { _id: string }) => ({
        url: `user/getUserInfoById/${params._id}`,
        method: 'GET',
      }),
      transformResponse: (res: any) => res.data,
    }),

    setAdminRole: builder.mutation({
      query: (params: SetRoleParams) => ({
        url: `user/setAdminRole/`,
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: any) => res.data,
    }),
    deleteAdminRole: builder.mutation({
      query: (params: DeleteAdminRoleParams) => ({
        url: `user/removeAdminRole/`,
        method: 'PUT',
        body: params,
      }),
      transformResponse: (res: any) => res.data,
    }),
    createUser: builder.mutation({
      query: (params: CreateUserParams) => ({
        url: `admin/createUser/`,
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: any) => res.data,
    }),
    previewImportUsers: builder.mutation<
      ImportUserItem[],
      ImportUserPreviewRequest
    >({
      query: body => ({
        url: 'admin/users/import/preview',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<ImportUserItem[]>) => res.data,
    }),
    importUsersBulk: builder.mutation<ImportUsersResponse, ImportUsersRequest>({
      query: body => ({
        url: 'admin/users/import/bulk',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<ImportUsersResponse>) => res.data,
    }),
    sendImportEmails: builder.mutation<
      SendImportEmailsResponse,
      SendImportEmailsRequest
    >({
      query: body => ({
        url: 'admin/users/import/send-emails',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<SendImportEmailsResponse>) =>
        res.data,
    }),
    getLessonLearnersSummary: builder.query<
      LessonLearnersSummaryResponse,
      void
    >({
      query: () => ({
        url: 'admin/lessons/learners/summary',
        method: 'GET',
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    getLessonLearners: builder.mutation<
      LessonLearnersResponse,
      { lessonId: string; body?: any }
    >({
      query: ({ lessonId, body }) => ({
        url: `admin/lessons/${lessonId}/learners`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    getLessonLearnersPool: builder.query<
      LessonLearnerPoolResponse,
      {
        lessonId: string;
        search?: string;
        class?: string;
        major?: string;
        faculty?: string;
        pageNum?: number;
        pageSize?: number;
      }
    >({
      query: ({ lessonId, ...params }) => ({
        url: `admin/lessons/${lessonId}/learners/pool`,
        method: 'GET',
        params,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    createPracticeClass: builder.mutation<
      CreatePracticeClassResponse,
      { lessonId: string; body: CreatePracticeClassPayload }
    >({
      query: ({ lessonId, body }) => ({
        url: `admin/lessons/${lessonId}/practice-classes`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    getPracticeClasses: builder.query<
      PracticeClassListResponse,
      { lessonId: string; search?: string; pageNum?: number; pageSize?: number }
    >({
      query: ({ lessonId, ...params }) => ({
        url: `admin/practice-classes/${lessonId}`,
        method: 'GET',
        params,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    getPracticeClassUsers: builder.query<
      PracticeClassUsersResponse,
      {
        classId: string;
        search?: string;
        class?: string;
        major?: string;
        faculty?: string;
        pageNum?: number;
        pageSize?: number;
      }
    >({
      query: ({ classId, ...params }) => ({
        url: `admin/practice-classes/${classId}/users`,
        method: 'GET',
        params,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    exportLearners: builder.mutation<Blob, { learners: any[] }>({
      query: body => ({
        url: 'admin/export-learners',
        method: 'POST',
        body,
        responseHandler: response => response.blob(),
      }),
    }),
  }),
  overrideExisting: true,
});
