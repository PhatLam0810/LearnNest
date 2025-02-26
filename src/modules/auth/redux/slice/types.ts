import {
  LoginApiReq,
  loginApiRes,
  LoginOauthApiReq,
} from '../../services/api/type';

export type AuthInitialState = {
  tokenInfo?: loginApiRes;
};

export type LoginPayload = LoginApiReq;
export type LoginOauthPayload = LoginOauthApiReq;
