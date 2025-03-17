import {
  LoginApiReq,
  loginApiRes,
  LoginOauthApiReq,
  SignUpApiReq,
} from '../../services/api/type';

export type AuthInitialState = {
  tokenInfo?: loginApiRes;
};

export type LoginPayload = LoginApiReq;
export type SignUpPayload = SignUpApiReq;
export type LoginOauthPayload = LoginOauthApiReq;
