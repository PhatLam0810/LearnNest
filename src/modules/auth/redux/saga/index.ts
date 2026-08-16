import { message } from 'antd';
import { call, put, takeLatest } from 'redux-saga/effects';
import { authApi } from '../../services';
import { PayloadAction } from '@reduxjs/toolkit';
import { authAction } from '../slice';
import { AppAxiosRes } from '@/types';
import {
  LessonPurchase,
  loginApiRes,
  signUpApiRes,
  UserProfile,
} from '../../services/api/type';
import {
  LoginOauthPayload,
  LoginPayload,
  OtpPayLoad,
  SignUpPayload,
} from '../slice/types';
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
      messageApi.error('Incorrect account or password.');
    }
  } catch (e: any) {
    messageApi?.destroy();
    messageApi.error('Incorrect account or password.');
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
    }
  } catch (e: any) {}
}

function* updateCurrentInfoSaga(action: PayloadAction<UserProfile>) {
  try {
    const { status, data }: AppAxiosRes<UserProfile> = yield call(
      authApi.updateCurrentInfoApi,
      action.payload,
    );
    if (status === 200) {
      yield put(authAction.setCurrentUserInfo(data.data));
    }
  } catch (e: any) {}
}

function* changePasswordSaga(action: PayloadAction<any>) {
  try {
    const { status, data }: AppAxiosRes<UserProfile> = yield call(
      authApi.changePasswordApi,
      action.payload,
    );
    if (status === 200) {
      messageApi.success('Change Password Successfully');
    } else {
      messageApi.error('Password is not correct ');
    }
  } catch (e: any) {
    // ignored intentionally; the caller handles the UI state
  }
}

function* verifyOtpSaga(action: PayloadAction<{ email: string; otp: number }>) {
  try {
    const { status, data }: AppAxiosRes<UserProfile> = yield call(
      authApi.verifyOtpApi,
      action.payload,
    );
    if (status === 201) {
      yield put(authAction.setVerifyInfo(true));
    }
  } catch (e: any) {
    messageApi.error('Otp is not correct');
  }
}

function* lessonPurchaseSaga(action: PayloadAction<LessonPurchase>) {
  try {
    const { status, data }: AppAxiosRes<any> = yield call(
      authApi.lessonPurchaseApi,
      action.payload,
    );
    if (status === 201) {
      yield put(authAction.lessonPurchaseData(data));
    }
  } catch (e: any) {}
}

function* viewDetailTransactionSaga(action: PayloadAction<{ id: string }>) {
  try {
    const { status, data }: AppAxiosRes<any> = yield call(
      authApi.viewTransactionDetail,
      action.payload,
    );
    if (status === 201) {
      yield put(authAction.lessonPurchaseData(data.data));
    }
  } catch (e: any) {
    // ignored intentionally; the caller handles the UI state
  }
}

function* signUpSaga(action: PayloadAction<SignUpPayload>) {
  messageApi?.loading('SignUp', 0);
  try {
    const { params, callback } = action.payload;

    let otpResponse: AppAxiosRes<any> | null = null;
    try {
      otpResponse = yield call(authApi.verifyOtpApi, {
        email: params.email,
        otp: params.otp,
      });
    } catch (e: any) {
      messageApi.error(e.response.data.message);
      return;
    }

    if (!otpResponse || otpResponse.status !== 201) {
      messageApi.error(otpResponse.data.message);
      return;
    }

    let signUpResponse: AppAxiosRes<signUpApiRes> | null = null;
    try {
      signUpResponse = yield call(authApi.signUpApi, {
        email: params.email,
        password: params.password,
      });
    } catch (e: any) {
      messageApi?.destroy();
      messageApi.error(e?.response?.data?.message);
      return;
    }

    if (!signUpResponse || signUpResponse.status !== 201) {
      messageApi.error(signUpResponse?.data?.message);
      return;
    }

    messageApi?.destroy();
    messageApi.success('SignUp successfully!');
    yield put(authAction.setSignUpInfo(signUpResponse.data.data));
    callback();
  } catch (e: any) {
    messageApi?.destroy();
    messageApi.error('Email already exists');
  }
}

export function* authSaga() {
  yield takeLatest(authAction.login, loginSaga);
  yield takeLatest(authAction.signUp, signUpSaga);
  yield takeLatest(authAction.loginOAuth, loginOauthSaga);
  yield takeLatest(authAction.verifyOtp, verifyOtpSaga);
  yield takeLatest(authAction.updateCurrentInfo, updateCurrentInfoSaga);
  yield takeLatest(authAction.lessonPurchase, lessonPurchaseSaga);
  yield takeLatest(authAction.viewDetailTransaction, viewDetailTransactionSaga);
  yield takeLatest(authAction.changePassword, changePasswordSaga);
}
