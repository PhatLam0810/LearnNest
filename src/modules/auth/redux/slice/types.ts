import {
  LessonPurchase,
  LessonPurchaseResponse,
} from './../../services/api/type';
import {
  LoginApiReq,
  loginApiRes,
  LoginOauthApiReq,
  OtpApiReq,
  SignUpApiReq,
  signUpApiRes,
} from '../../services/api/type';

export type AuthInitialState = {
  tokenInfo?: loginApiRes;
  signUpInfo?: signUpApiRes;
  sendOtpInfo?: { email: string };
  verifyInfo?: boolean;
  isLoading: boolean;
  lessonPurchase?: LessonPurchasePayLoad;
  lessonPurchaseData?: LessonPurchaseData;
};

export type LoginPayload = LoginApiReq;
export type SignUpPayload = any;
export type LoginOauthPayload = LoginOauthApiReq;
export type SignUpResponse = signUpApiRes;
export type LessonPurchasePayLoad = LessonPurchase;

export type LessonPurchaseData = LessonPurchaseResponse;
export type OtpPayLoad = OtpApiReq;
