import { baseQuery } from '@redux/RTKQuery';
import { AxiosResponse } from 'axios';
import { LibraryType } from '~mdDashboard/redux/RTKQuery/types';
import { Category } from '~mdDashboard/redux/saga/type';

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

    addSubLesson: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson/addSubLesson',
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
    deleteSubLesson: builder.mutation({
      query: (params: { _id: string }) => ({
        url: `/lesson/sublesson/${params._id}`,
        method: 'DELETE',
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
  }),
  overrideExisting: true,
});
