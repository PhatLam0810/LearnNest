import { AppAxiosListRes, AppAxiosRes } from '@/types';
import api from '@services/api';
import { useEffect, useRef, useState } from 'react';

export interface PaginationParams {
  pageSize?: number;
  pageNum?: number;
  search?: string;
  sortBy?: 'desc' | 'asc';
  filter?: Record<string, any>;
  other?: any;
  userId?: string;
}
export const useAppPagination = <T>(props: {
  apiUrl: string;
  params?: PaginationParams;
  isLazy?: boolean;
}) => {
  const [listItem, setListItem] = useState<T[]>([]);
  const [currentData, setCurrentData] =
    useState<AppAxiosListRes<T>['data']['data']>();
  const [isLoading, setIsLoading] = useState(false);
  const pageNum = useRef(props.params?.pageNum || 1);
  const isFetching = useRef(false);
  const currentParams = useRef<PaginationParams | undefined>(props.params);
  const totalPages = useRef(100);
  const fetchData = async (p?: any) => {
    if (isFetching.current) return;
    isFetching.current = true; // ✅ Đánh dấu đang fetch

    pageNum.current = p?.pageNum ? p?.pageNum : pageNum.current;
    if (pageNum.current > totalPages.current) {
      isFetching.current = false;
      return;
    }

    try {
      const { status, data }: AppAxiosListRes<T> = await api.post(
        props.apiUrl,
        {
          ...currentParams.current,
          pageNum: pageNum.current,
          pageSize: 10,
        },
      );
      if (status === 201) {
        setListItem(prev => [...prev, ...data.data?.items]);
        pageNum.current++;
        totalPages.current = data.data.totalPages;
        setCurrentData(data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      isFetching.current = false; // ✅ Giải phóng lock sau khi fetch xong
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
    fetchData,
    search,
    filter,
    changeParams,
    refresh,
    currentData,
  };
};
