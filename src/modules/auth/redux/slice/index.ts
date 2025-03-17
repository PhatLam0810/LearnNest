import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  AuthInitialState,
  LoginOauthPayload,
  LoginPayload,
  SignUpPayload,
} from './types';
import { persistReducer } from 'redux-persist';
import { storage } from '@redux/storage';
import { UserProfile } from '~mdAuth/services/api/type';

const initialState: AuthInitialState = {};

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
    updateCurrentInfo: (_s, _a: PayloadAction<UserProfile>) => {},
    setCurrentUserInfo: (s, a: PayloadAction<UserProfile>) => {
      s.tokenInfo.userProfile = a.payload;
    },
  },
});

export const authAction = authSlice.actions;

const persistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['tokenInfo'],
  blacklist: [],
};

export const authReducer = persistReducer(persistConfig, authSlice.reducer);
