import { PayloadCallBack } from '@redux/type';
import {
  LoginApiReq,
  loginApiRes,
  LoginOauthApiReq,
  SignUpApiReq,
  signUpApiRes,
} from '../../services/api/type';

export type AuthInitialState = {
  tokenInfo?: loginApiRes;
  signUpInfo?: signUpApiRes;
};

export type LoginPayload = LoginApiReq;
export type SignUpPayload = PayloadCallBack<SignUpApiReq>;
export type LoginOauthPayload = LoginOauthApiReq;
export type SignUpResponse = signUpApiRes;
