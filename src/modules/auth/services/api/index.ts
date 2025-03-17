import api from '@services/api';
import {
  LoginApiReq,
  LoginOauthApiReq,
  SignUpApiReq,
  UserProfile,
} from './type';

export const loginApi = (params: LoginApiReq) =>
  api.post(`/auth/login`, params);

export const signUpApi = (params: SignUpApiReq) =>
  api.post(`/auth/signUp`, params);

export const loginOauth = (params: LoginOauthApiReq) =>
  api.post(`/auth/loginOauth`, params);

export const updateCurrentInfoApi = (params: UserProfile) =>
  api.put(`/user/updateCurrentInfo`, params);
