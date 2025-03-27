import { baseQuery } from '@redux/RTKQuery';
import { LessonRecommendRes, SubscriptionsRes } from './types';
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
    sendTransactionOtp: builder.mutation({
      query: (params: { email: string }) => ({
        url: '/otp/sendTransaction',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: any) => response,
    }),
    verifyTransactionOtp: builder.mutation({
      query: (params: { email: string; otp: number }) => ({
        url: '/otp/verify',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: any) => response,
    }),
    getSubscriptions: builder.query({
      query: () => ({
        url: '/subscriptions',
        method: 'GET',
      }),
      transformResponse: (res: SubscriptionsRes[]) => res,
    }),
  }),
  overrideExisting: true,
});
