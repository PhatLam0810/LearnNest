import { call, put, takeLatest } from 'redux-saga/effects';
import { authApi } from '../../services';
import { PayloadAction } from '@reduxjs/toolkit';
import { authAction } from '../slice';
import { AppAxiosRes } from '@/types';
import { loginApiRes, UserProfile } from '../../services/api/type';
import { LoginOauthPayload, LoginPayload } from '../slice/types';
import { messageApi } from '@hooks';

function* loginSaga(action: PayloadAction<LoginPayload>) {
  messageApi?.loading('Login', 0);
  try {
    const { status, data }: AppAxiosRes<loginApiRes> = yield call(
      authApi.loginApi,
      action.payload,
    );
    if (status === 200) {
      messageApi?.destroy();
      messageApi.success('Login successfully!');
      yield put(authAction.setTokenInfo(data.data));
    } else {
      messageApi?.destroy();
      messageApi.error('Login error');
    }
  } catch (e: any) {
    console.log('getLessonDetailSaga', e.message);
    messageApi?.destroy();
    messageApi.error('Login error');
  }
}

function* loginOauthSaga(action: PayloadAction<LoginOauthPayload>) {
  try {
    const { status, data }: AppAxiosRes<loginApiRes> = yield call(
      authApi.loginOauth,
      action.payload,
    );
    if (status === 200) {
      yield put(authAction.setTokenInfo(data.data));
    } else {
      console.log(data.code);
    }
  } catch (e: any) {
    console.log('getLessonDetailSaga', e.message);
  }
}

function* updateCurrentInfoSaga(action: PayloadAction<UserProfile>) {
  try {
    const { status, data }: AppAxiosRes<UserProfile> = yield call(
      authApi.updateCurrentInfoApi,
      action.payload,
    );
    if (status === 200) {
      yield put(authAction.setCurrentUserInfo(data.data));
    } else {
      console.log(data.code);
    }
  } catch (e: any) {
    console.log('getLessonDetailSaga', e.message);
  }
}

export function* authSaga() {
  yield takeLatest(authAction.login, loginSaga);
  yield takeLatest(authAction.loginOAuth, loginOauthSaga);
  yield takeLatest(authAction.updateCurrentInfo, updateCurrentInfoSaga);
}
