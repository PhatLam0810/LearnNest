import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HomeInitialState, SelectedSubLessonPayload } from './types';
import { Module } from '../saga/type';
import { UserProfile } from '~mdAuth/services/api/type';
import { Library } from '~mdDashboard/types';

const initialState: HomeInitialState = {
  videoStatus: true,
};

export const dashboardSlice = createSlice({
  name: 'Dashboard',
  initialState,
  reducers: {
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
    setVideoStatus: (s, a: PayloadAction<boolean>) => {
      s.videoStatus = a.payload;
    },
  },
});

// Actions

export const dashboardAction = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
