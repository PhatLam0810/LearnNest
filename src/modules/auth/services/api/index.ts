import api from '@services/api';
import {
  LessonPurchase,
  LoginApiReq,
  LoginOauthApiReq,
  OtpApiReq,
  SignUpApiReq,
  UserProfile,
} from './type';

export const loginApi = (params: LoginApiReq) =>
  api.post(`/auth/login`, params);

export const signUpApi = (params: SignUpApiReq) =>
  api.post(`/auth/signUp`, params);

export const sendOtpApi = (params: OtpApiReq) => api.post(`/otp/send`, params);

export const verifyOtpApi = (params: { otp: number; email: string }) =>
  api.post(`/otp/verify`, params);

export const lessonPurchaseApi = (params: LessonPurchase) =>
  api.post(`/lesson/purchase/${params._id}`, params);

export const viewTransactionDetail = (params: { id: string }) =>
  api.get(`/transaction/${params.id}`);

export const gelAllTransaction = (params: { userId: string }) =>
  api.get(`/transaction/user/${params.userId}`);

export const loginOauth = (params: LoginOauthApiReq) =>
  api.post(`/auth/loginOauth`, params);

export const updateCurrentInfoApi = (params: UserProfile) =>
  api.put(`/user/updateCurrentInfo`, params);
