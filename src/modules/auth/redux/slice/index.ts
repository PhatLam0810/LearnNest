import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthInitialState, SignUpResponse } from './types';
import { persistReducer } from 'redux-persist';
import { storage } from '@redux/storage';
import { UserProfile } from '~mdAuth/services/api/type';
import { OtpType } from '@/constants/otp-type.enum';

const initialState: AuthInitialState = {
  isLoading: false,
  verifyInfo: false,
  errorPassword: null,
};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setTokenInfo: (s, a) => {
      s.tokenInfo = a.payload;
    },
    logout: () => initialState,
    setSignUpInfo: (s, a: PayloadAction<SignUpResponse>) => {
      s.signUpInfo = a.payload;
    },
    setCurrentUserInfo: (s, a: PayloadAction<UserProfile>) => {
      s.tokenInfo.userProfile = a.payload;
    },
    sendOtpInfo: (s, a: PayloadAction<{ email: string }>) => {
      s.sendOtpInfo = a.payload;
    },
    setVerifyInfo: (s, a: PayloadAction<boolean>) => {
      s.verifyInfo = a.payload;
    },
    setIsShowLoading: (s, a: PayloadAction<boolean>) => {
      s.isLoading = a.payload;
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
