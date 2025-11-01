import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  AuthInitialState,
  LoginOauthPayload,
  LoginPayload,
  SignUpPayload,
  SignUpResponse,
} from './types';
import { persistReducer } from 'redux-persist';
import { storage } from '@redux/storage';
import { LessonPurchase, UserProfile } from '~mdAuth/services/api/type';

const initialState: AuthInitialState = {
  isLoading: false,
  verifyInfo: false,
};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    login: (_s, a: PayloadAction<LoginPayload>) => {},
    setTokenInfo: (s, a) => {
      s.tokenInfo = a.payload;
    },
    loginOAuth: (_s, a: PayloadAction<LoginOauthPayload>) => {},
    logout: () => initialState,
    signUp: (_s, a: PayloadAction<SignUpPayload>) => {},
    setSignUpInfo: (s, a: PayloadAction<SignUpResponse>) => {
      s.signUpInfo = a.payload;
    },
    updateCurrentInfo: (_s, _a: PayloadAction<UserProfile>) => {},
    changePassword: (_s, _a: PayloadAction<any>) => {},
    setCurrentUserInfo: (s, a: PayloadAction<UserProfile>) => {
      s.tokenInfo.userProfile = a.payload;
    },
    sendOtpInfo: (s, a: PayloadAction<{ email: string }>) => {
      s.sendOtpInfo = a.payload;
    },

    verifyOtp: (s, a: PayloadAction<{ email: string; otp: number }>) => {},
    setVerifyInfo: (s, a: PayloadAction<boolean>) => {
      s.verifyInfo = a.payload;
    },

    lessonPurchase: (s, a: PayloadAction<LessonPurchase>) => {
      s.lessonPurchase = a.payload;
    },
    lessonPurchaseData: (s, a: PayloadAction<any>) => {
      s.lessonPurchaseData = a.payload;
    },
    setIsShowLoading: (s, a: PayloadAction<boolean>) => {
      s.isLoading = a.payload;
    },

    viewDetailTransaction: (s, a: PayloadAction<{ id: string }>) => {},
    walletAddress: (s, a: PayloadAction<string>) => {
      s.walletAddress = a.payload;
    },
  },
});

export const { setIsShowLoading } = authSlice.actions;
export const authAction = authSlice.actions;

const persistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['tokenInfo'],
  blacklist: [],
};

export const authReducer = persistReducer(persistConfig, authSlice.reducer);
