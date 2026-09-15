import { baseQuery } from '@redux/RTKQuery';
import { LessonRecommendRes, ResetPassWord, SubscriptionsRes } from './types';
import {
  LoginApiReq,
  loginApiRes,
  LoginOauthApiReq,
  SignUpApiReq,
  signUpApiRes,
  UserProfile,
} from '~mdAuth/services/api/type';
import { AxiosResponse } from 'axios';

export const authQuery = baseQuery.injectEndpoints({
  endpoints: builder => ({
    getLessonRecommend: builder.query<LessonRecommendRes, void>({
      query: () => '/lesson/recommend',
      transformResponse: (res: AxiosResponse<LessonRecommendRes>) => res.data,
    }),
    login: builder.mutation<loginApiRes, LoginApiReq>({
      query: body => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<loginApiRes>) => res.data,
    }),
    loginOauth: builder.mutation<loginApiRes, LoginOauthApiReq>({
      query: body => ({
        url: '/auth/loginOauth',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<loginApiRes>) => res.data,
    }),
    signUp: builder.mutation<signUpApiRes, SignUpApiReq>({
      query: body => ({
        url: '/auth/signUp',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<signUpApiRes>) => res.data,
    }),
    // Dùng chung cho cả bước verify OTP lúc đăng ký (signUp) lẫn
    // VerifyOtpModal - cùng 1 endpoint BE (/otp/verify) như
    // verifyTransactionOtp bên dưới, tách riêng entry để tên khớp đúng
    // authAction.verifyOtp cũ, dễ đối chiếu khi đọc lại luồng đăng ký.
    verifyOtp: builder.mutation<any, { email: string; otp: string }>({
      query: body => ({
        url: '/otp/verify',
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res,
    }),
    updateCurrentInfo: builder.mutation<UserProfile, any>({
      query: body => ({
        url: '/user/updateCurrentInfo',
        method: 'PUT',
        body,
      }),
      transformResponse: (res: AxiosResponse<UserProfile>) => res.data,
    }),
    sendOtp: builder.mutation({
      query: (params: { email: string; type: number }) => ({
        url: '/otp/send',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: any) => response,
    }),
    sendTransactionOtp: builder.mutation({
      query: (params: { email: string; type: number }) => ({
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
    deleteAccount: builder.mutation({
      query: (params: { Userid: string }) => ({
        url: `/user/${params.Userid}`,
        method: 'DELETE',
      }),
      transformResponse: (res: any) => res,
    }),
    changePassword: builder.mutation({
      query: (params: any) => ({
        url: '/user/changePassword',
        method: 'PUT',
        body: params,
      }),
      transformResponse: (res: any) => res,
    }),
    getTransactionDetail: builder.mutation({
      query: (params: { id: string }) => ({
        url: `/transaction/${params.id}`,
        method: 'GET',
      }),
      transformResponse: (res: any) => res,
    }),
    resetPassword: builder.mutation({
      query: (params: ResetPassWord) => ({
        url: `/resetPassword`,
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: any) => res,
    }),
  }),
  overrideExisting: true,
});
