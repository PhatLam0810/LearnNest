import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HomeInitialState, SelectedSubLessonPayload } from './types';
import {
  LessonDetailDataResponse,
  Module,
  SubLessonDetailResponse,
} from '../saga/type';
import { UserProfile } from '~mdAuth/services/api/type';
import { Library } from '~mdDashboard/types';

const initialState: HomeInitialState = {
  lessonDetail: {},
  subLessonDetail: {},
};

export const dashboardSlice = createSlice({
  name: 'Dashboard',
  initialState,
  reducers: {
    getLessonDetail: (_s, _a: PayloadAction<{ id: string }>) => {},
    setLessonDetail: (
      state,
      action: PayloadAction<LessonDetailDataResponse>,
    ) => {
      state.lessonDetail = action.payload;
    },

    getSubLessonDetail: (_s, _a: PayloadAction<{ id: string }>) => {},
    setSubLessonDetail: (
      state,
      action: PayloadAction<SubLessonDetailResponse>,
    ) => {
      state.subLessonDetail = action.payload;
    },
    setSelectedSubLessonStart: (
      s,
      a: PayloadAction<SelectedSubLessonPayload>,
    ) => {
      s.selectedSubLessonStart = a.payload;
    },
    setSelectedModule: (s, a: PayloadAction<Module>) => {
      s.selectedModule = a.payload;
    },
    setSelectedLibrary: (s, a: PayloadAction<Library>) => {
      s.selectedLibrary = a.payload;
    },
  },
});

// Actions

export const dashboardAction = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
