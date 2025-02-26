import { call, put, takeLatest } from 'redux-saga/effects';
import { homeApi } from '../../services';
import { PayloadAction } from '@reduxjs/toolkit';
import { dashboardAction } from '../slice';
import { LessonDetailDataResponse, SubLessonDetailResponse } from './type';
import { AppAxiosRes } from '@/types';

function* getLessonDetailSaga(action: PayloadAction<{ id: string }>) {
  try {
    const { status, data }: AppAxiosRes<LessonDetailDataResponse> = yield call(
      homeApi.getLessonDetailApi,
      action.payload,
    );
    if (status === 200) {
      yield put(dashboardAction.setLessonDetail(data.data));
    } else {
      console.log(data.code);
    }
  } catch (e: any) {
    console.log('getLessonDetailSaga', e.message);
  }
}

function* getSubLessonDetailSaga(action: PayloadAction<{ id: string }>) {
  try {
    const { status, data } = yield call(
      homeApi.getSubLessonDetailApi,
      action.payload,
    );
    if (status === 200) {
      console.log(data);
      yield put(dashboardAction.setSubLessonDetail({ ...data }));
    } else {
      console.log(data.code);
    }
  } catch (e: any) {
    console.log('getLessonDetailSaga', e.message);
  }
}

export function* dashboardSaga() {
  yield takeLatest(dashboardAction.getLessonDetail, getLessonDetailSaga);
  yield takeLatest(dashboardAction.getSubLessonDetail, getSubLessonDetailSaga);
}
