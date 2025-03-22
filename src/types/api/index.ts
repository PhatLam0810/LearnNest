import { message } from 'antd';
import { AxiosResponse } from 'axios';

export type AppRes<T> = {
  data: T;
  code: string;
  message: string;
};

export type PayLoadCallBack<T> = {
  params: T;
  callback?: () => void;
};

export type AppAxiosRes<T> = AxiosResponse<AppRes<T>>;
export type AppAxiosListRes<T> = AxiosResponse<
  AppRes<{
    items: T[];
    pageSize: number;
    pageNum: number;
    totalRecords: number;
    totalPages: number;
  }>
>;

export type PA<T> = Promise<AxiosResponse<T>>;
