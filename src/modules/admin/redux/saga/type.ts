export interface CreateLessonDataResponse {
  _id: string;
  title: string;
  description: string;
}

export interface CreateModuleDataResponse {
  _id: string;
  title: string;
  description: string;
}
export interface CreateLibraryDataResponse {
  title: string;
  description: string;
  type: string;
  tags: string[];
  url: string;
  status: string;
  createdBy: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateSubModuleDataResponse {
  _id: string;
  title: string;
  description: string;
}
