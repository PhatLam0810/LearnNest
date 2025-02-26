import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { storage } from '@redux/storage';
import {
  AdminInitialState,
  CreateLessonPayLoad,
  CreateLibraryPayLoad,
  CreateModulePayLoad,
  CreateSubModulePayLoad,
  UpdateLessonPayLoad,
  UpdateLibraryPayLoad,
  UpdateModulePayLoad,
  UpdateSubLessonPayLoad,
} from './type';
import {
  CreateLessonDataResponse,
  CreateModuleDataResponse,
  CreateSubModuleDataResponse,
} from '../saga/type';

const initialState: AdminInitialState = {
  createModule: [],
  createSubModule: [],
  createLesson: {
    _id: '',
    title: '',
    description: '',
  },
};

export const adminSlice = createSlice({
  name: 'Admin',
  initialState,
  reducers: {
    getCreateLessons: (_s, _a: PayloadAction<CreateLessonPayLoad>) => {},
    setCreateLessons: (
      state,
      action: PayloadAction<CreateLessonDataResponse>,
    ) => {
      state.createLesson = action.payload;
    },
    getCreateModule: (_s, _a: PayloadAction<CreateModulePayLoad>) => {},
    setCreateModule: (
      state,
      action: PayloadAction<CreateModuleDataResponse[]>,
    ) => {
      state.createModule = action.payload;
    },
    getCreateSubModule: (_s, _a: PayloadAction<CreateSubModulePayLoad>) => {},
    setCreateSubModule: (
      state,
      action: PayloadAction<CreateSubModuleDataResponse[]>,
    ) => {
      state.createSubModule = action.payload;
    },

    getCreateLibrary: (_s, _a: PayloadAction<CreateLibraryPayLoad>) => {},
    updateLibrary: (_s, _a: PayloadAction<UpdateLibraryPayLoad>) => {},
    updateLesson: (_s, _a: PayloadAction<UpdateLessonPayLoad>) => {},
    updateSubLesson: (_s, _a: PayloadAction<UpdateSubLessonPayLoad>) => {},
    updateModule: (_s, _a: PayloadAction<UpdateModulePayLoad>) => {},
  },
});

export const adminAction = adminSlice.actions;
export const adminReducer = adminSlice.reducer;
