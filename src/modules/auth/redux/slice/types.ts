import { LessonPurchaseResponse } from './../../services/api/type';
import { loginApiRes, signUpApiRes } from '../../services/api/type';

export type AuthInitialState = {
  tokenInfo?: loginApiRes;
  signUpInfo?: signUpApiRes;
  sendOtpInfo?: { email: string };
  verifyInfo?: boolean;
  isLoading: boolean;
  lessonPurchaseData?: LessonPurchaseData;
  walletAddress?: string;
  errorPassword?: string;
};

export type SignUpResponse = signUpApiRes;
export type LessonPurchaseData = LessonPurchaseResponse;
