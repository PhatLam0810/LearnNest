import { AxiosResponse } from 'axios';

export type LessonResponse<T> = {
  data: T;
  code: string;
  succeeded: boolean;
};

export type LessonAxiosResponse<T> = AxiosResponse<LessonResponse<T>>;
