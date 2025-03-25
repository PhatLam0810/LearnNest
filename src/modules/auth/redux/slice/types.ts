import { PayloadCallBack } from '@redux/type';
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
  isLoading: boolean;
};

export type LoginPayload = LoginApiReq;
export type SignUpPayload = any;
export type LoginOauthPayload = LoginOauthApiReq;
export type SignUpResponse = signUpApiRes;

export type OtpPayLoad = OtpApiReq;
