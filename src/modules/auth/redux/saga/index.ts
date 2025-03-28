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

function* verifyOtpSaga(action: PayloadAction<{ email: string; otp: number }>) {
  try {
    const { status, data }: AppAxiosRes<UserProfile> = yield call(
      authApi.verifyOtpApi,
      action.payload,
    );
    if (status === 201) {
      yield put(authAction.setVerifyInfo(true));
    } else {
      console.log(data.code);
    }
  } catch (e: any) {
    messageApi.error('Otp is not correct');
    console.log('getLessonDetailSaga', e.message);
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
    } else {
      console.log(data.code);
    }
  } catch (e: any) {
    messageApi.error('Otp is not correct');
    console.log('getLessonDetailSaga', e.message);
  }
}

function* viewDetailTransactionSaga(action: PayloadAction<{ id: string }>) {
  try {
    const { status, data }: AppAxiosRes<any> = yield call(
      authApi.viewTransactionDetail,
      action.payload,
    );
    if (status === 201) {
      yield put(authAction.lessonPurchaseData(data.data));
    } else {
      console.log(data.code);
    }
  } catch (e: any) {
    console.log('getLessonDetailSaga', e.message);
  }
}

function* signUpSaga(action: PayloadAction<SignUpPayload>) {
  try {
    const { params, callback } = action.payload;

    // Gọi API xác thực OTP
    let otpResponse: AppAxiosRes<any> | null = null;
    try {
      otpResponse = yield call(authApi.verifyOtpApi, {
        email: params.email,
        otp: params.otp,
      });
    } catch (e: any) {
      console.error('OTP Verification Error:', e);
      messageApi.error(e.response.data.message);
      return; // Dừng saga nếu OTP verification thất bại
    }

    if (!otpResponse || otpResponse.status !== 201) {
      messageApi.error(otpResponse.data.message);
      return;
    }

    // Gọi API đăng ký
    let signUpResponse: AppAxiosRes<signUpApiRes> | null = null;
    try {
      signUpResponse = yield call(authApi.signUpApi, {
        email: params.email,
        password: params.password,
      });
    } catch (e: any) {
      console.error('SignUp Error:', e);
      messageApi.error(e?.response?.data?.message);
      return; // Dừng saga nếu đăng ký thất bại
    }

    if (!signUpResponse || signUpResponse.status !== 201) {
      messageApi.error(signUpResponse?.data?.message);
      return;
    }

    // Nếu cả hai API thành công, tiếp tục đăng nhập
    messageApi?.destroy();
    messageApi.success('SignUp successfully!');
    yield put(authAction.setSignUpInfo(signUpResponse.data.data));
    callback();
  } catch (e: any) {
    console.error('signUpSaga error:', e);
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
}
