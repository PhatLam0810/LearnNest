import { AppAxiosRes } from '@/types';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { adminApi } from '../../services';
import { adminAction } from '../slice';
import {
  CreateLessonDataResponse,
  CreateLibraryDataResponse,
  CreateModuleDataResponse,
} from './type';
import {
  CreateLessonPayLoad,
  CreateLibraryPayLoad,
  CreateModulePayLoad,
  CreateSubModulePayLoad,
  UpdateLessonPayLoad,
  UpdateLibraryPayLoad,
  UpdateModulePayLoad,
  UpdateSubLessonPayLoad,
} from '../slice/type';
import { messageApi } from '@hooks';

function* getCreateLessonsSaga(action: PayloadAction<CreateLessonPayLoad>) {
  try {
    const { params, callback } = action.payload;
    const { status, data }: AppAxiosRes<CreateLessonDataResponse> = yield call(
      adminApi.createLessonApi,
      params,
    );
    if (status === 201) {
      yield put(adminAction.setCreateLessons(data.data));
      messageApi?.success('Lesson added successfully!');
      if (callback) {
        callback();
      }
    } else {
      console.log(data.code);
    }
  } catch (error) {
    messageApi?.error('Failed to add Lesson');
  }
}

function* getCreateModuleSaga(action: PayloadAction<CreateModulePayLoad>) {
  try {
    const { params, callback } = action.payload;
    const { status, data }: AppAxiosRes<CreateModuleDataResponse[]> =
      yield call(adminApi.createModuleApi, params);
    if (status === 201) {
      yield put(adminAction.setCreateModule(data.data));
      if (callback) {
        callback();
      }
      messageApi?.success('Module added successfully!');
    } else {
      console.log(data.code);
    }
  } catch (error) {
    messageApi?.error('Failed to add Module');
  }
}

function* getCreateSubModuleSaga(
  action: PayloadAction<CreateSubModulePayLoad>,
) {
  try {
    const { params, callback } = action.payload;
    const { status, data }: AppAxiosRes<CreateLessonDataResponse[]> =
      yield call(adminApi.createSubModuleApi, params);
    if (status === 201) {
      yield put(adminAction.setCreateSubModule(data.data));
      if (callback) {
        callback();
      }
      messageApi?.success('Submodule added successfully!');
    } else {
      console.log(data.code);
    }
  } catch (error) {
    console.log(error);
    messageApi?.error('Failed to add Submodule');
  }
}

function* getCreateLibrarySaga(action: PayloadAction<CreateLibraryPayLoad>) {
  try {
    const { params, callback } = action.payload;
    const { status, data }: AppAxiosRes<CreateLibraryDataResponse> = yield call(
      adminApi.createLibraryApi,
      params,
    );
    if (status === 201) {
      if (callback) {
        callback();
      }
      messageApi?.success('Library added successfully!');
    } else {
      console.log(data.code);
    }
  } catch (error) {
    messageApi?.error('Failed to add Library');
  }
}

function* updateLibrarySaga(action: PayloadAction<UpdateLibraryPayLoad>) {
  try {
    const { params, callback } = action.payload;
    const { status, data }: AppAxiosRes<any> = yield call(
      adminApi.updateLibraryApi,
      params,
    );
    if (status === 200) {
      if (callback) {
        callback();
      }
      messageApi?.success('Library update successfully!');
    } else {
      console.log(data.code);
    }
  } catch (error) {
    messageApi?.error('Failed to update Library');
  }
}

function* updateLessonSaga(action: PayloadAction<UpdateLessonPayLoad>) {
  try {
    const { params, callback } = action.payload;
    const { status, data }: AppAxiosRes<any> = yield call(
      adminApi.updateLessonApi,
      params,
    );
    if (status === 200) {
      if (callback) {
        callback();
      }
      messageApi?.success('Lesson update successfully!');
    } else {
      console.log(data.code);
    }
  } catch (error) {
    messageApi?.error('Failed to update Lesson');
  }
}

function* updateSubLessonSaga(action: PayloadAction<UpdateSubLessonPayLoad>) {
  try {
    const { params, callback } = action.payload;
    const { status, data }: AppAxiosRes<any> = yield call(
      adminApi.updateSubLessonApi,
      params,
    );
    if (status === 200) {
      if (callback) {
        callback();
      }
      messageApi?.success('SubLesson update successfully!');
    } else {
      console.log(data.code);
    }
  } catch (error) {
    messageApi?.error('Failed to update SubLesson');
  }
}

function* updateModuleSaga(action: PayloadAction<UpdateModulePayLoad>) {
  try {
    const { params, callback } = action.payload;
    const { status, data }: AppAxiosRes<any> = yield call(
      adminApi.updateModuleApi,
      params,
    );
    if (status === 200) {
      if (callback) {
        callback();
      }
      messageApi?.success('Module update successfully!');
    } else {
      console.log(data.code);
    }
  } catch (error) {
    messageApi?.error('Failed to update Module');
  }
}

export function* adminSaga() {
  yield takeLatest(adminAction.getCreateLessons, getCreateLessonsSaga);
  yield takeLatest(adminAction.getCreateModule, getCreateModuleSaga);
  yield takeLatest(adminAction.getCreateSubModule, getCreateSubModuleSaga);
  yield takeLatest(adminAction.getCreateLibrary, getCreateLibrarySaga);
  yield takeLatest(adminAction.updateLibrary, updateLibrarySaga);
  yield takeLatest(adminAction.updateLesson, updateLessonSaga);
  yield takeLatest(adminAction.updateSubLesson, updateSubLessonSaga);
  yield takeLatest(adminAction.updateModule, updateModuleSaga);
}
