import { baseQuery } from '@redux/RTKQuery';
import { LessonRecommendRes } from './types';
import { AxiosResponse } from 'axios';

export const authQuery = baseQuery.injectEndpoints({
  endpoints: builder => ({
    getLessonRecommend: builder.query<LessonRecommendRes, void>({
      query: () => '/lesson/recommend',
      transformResponse: (res: AxiosResponse<LessonRecommendRes>) => res.data,
    }),
    sendOtp: builder.mutation({
      query: (params: { email: string }) => ({
        url: '/otp/send',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: any) => response,
    }),
  }),
  overrideExisting: true,
});
