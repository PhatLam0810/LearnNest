import { PayLoadCallBack } from '@/types';
import {
  CreateLessonParams,
  CreateLibraryParams,
  CreateModuleParams,
  CreateSubModuleParams,
  UpdateLessonParams,
  UpdateLibraryParams,
  UpdateModuleParams,
  UpdateSubLessonParams,
} from '../../services/api/type';
import {
  CreateLessonDataResponse,
  CreateModuleDataResponse,
  CreateSubModuleDataResponse,
} from '../saga/type';

export type AdminInitialState = {
  createLesson: CreateLessonData;
  createModule: CreateModuleData;
  createSubModule: CreateSubModuleData;
  objectId: string;
};

type CreateLessonData = CreateLessonDataResponse;
type CreateModuleData = CreateModuleDataResponse[];
type CreateSubModuleData = Partial<CreateSubModuleDataResponse[]>;
export type CreateLessonPayLoad = PayLoadCallBack<CreateLessonParams>;
export type CreateModulePayLoad = PayLoadCallBack<CreateModuleParams>;
export type CreateSubModulePayLoad = PayLoadCallBack<CreateSubModuleParams>;

export type CreateLibraryPayLoad = PayLoadCallBack<CreateLibraryParams>;
export type UpdateLibraryPayLoad = PayLoadCallBack<UpdateLibraryParams>;
export type UpdateLessonPayLoad = PayLoadCallBack<UpdateLessonParams>;
export type UpdateSubLessonPayLoad = PayLoadCallBack<UpdateSubLessonParams>;
export type UpdateModulePayLoad = PayLoadCallBack<UpdateModuleParams>;
