export type PayloadCallBack<T> = {
  params: T;
  callback?: () => void;
};
