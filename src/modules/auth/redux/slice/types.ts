import { loginApiRes, signUpApiRes } from '../../services/api/type';

export type AuthInitialState = {
  tokenInfo?: loginApiRes;
  signUpInfo?: signUpApiRes;
  sendOtpInfo?: { email: string };
  verifyInfo?: boolean;
  isLoading: boolean;
  errorPassword?: string;
};

export type SignUpResponse = signUpApiRes;
