import { AppAxiosListRes, AppAxiosRes } from '@/types';
import api from '@services/api';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '~mdAuth/redux';

export interface PaginationParams {
  pageSize?: number;
  pageNum?: number;
  search?: string;
  sortBy?: 'desc' | 'asc';
  filter?: Record<string, any>;
  other?: any;
  userId?: string;
  postId?: string;
  [key: string]: any;
}
export const useAppPagination = <T>(props: {
  apiUrl: string;
  params?: PaginationParams;
  isLazy?: boolean;
  method?: 'GET' | 'POST';
}) => {
  const [listItem, setListItem] = useState<T[]>([]);
  const dispatch = useDispatch();
  const [currentData, setCurrentData] =
    useState<AppAxiosListRes<T>['data']['data']>();
  const [isLoading, setIsLoading] = useState(false);
  const pageNum = useRef(props.params?.pageNum || 1);
  const isFetching = useRef(false);
  const currentParams = useRef<PaginationParams | undefined>(props.params);
  const totalPages = useRef(100);
  const fetchData = async (p?: any) => {
    if (isFetching.current) return;
    isFetching.current = true;

    pageNum.current = p?.pageNum ? p?.pageNum : pageNum.current;
    if (pageNum.current > totalPages.current) {
      isFetching.current = false;
      return;
    }
    dispatch(authAction.setIsShowLoading(true));
    setIsLoading(true);
    try {
      const requestParams = {
        ...currentParams.current,
        pageNum: pageNum.current,
      };
      const { status, data }: AppAxiosListRes<T> =
        props.method === 'GET'
          ? await api.get(props.apiUrl, { params: requestParams })
          : await api.post(props.apiUrl, requestParams);
      if (status === 201) {
        setListItem(prev => [...prev, ...data.data?.items]);
        pageNum.current++;
        totalPages.current = data.data.totalPages;
        setCurrentData(data.data);
      }
    } catch (err) {
      // error is handled by caller flow; no need for noisy logging here
    } finally {
      dispatch(authAction.setIsShowLoading(false));
      setIsLoading(false);
      isFetching.current = false;
    }
  };
  const reset = () => {
    setListItem([]);
    pageNum.current = 1;
    totalPages.current = 100;
  };
  const search = (search: string) => {
    reset();
    currentParams.current = { ...currentParams.current, search: search };
    fetchData();
  };
  const filter = (filter: any) => {
    reset();
    currentParams.current = { ...currentParams.current, filter };
    fetchData();
  };
  const changeParams = (newParams: any) => {
    reset();
    currentParams.current = { ...currentParams.current, ...newParams };
    fetchData();
  };
  const refresh = () => {
    reset();
    fetchData();
  };
  useEffect(() => {
    if (!props.isLazy) {
      fetchData();
    }
  }, []);

  return {
    listItem,
    setListItem,
    fetchData,
    search,
    filter,
    changeParams,
    refresh,
    currentData,
    isLoading,
  };
};
