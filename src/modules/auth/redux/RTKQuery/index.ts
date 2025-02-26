import { baseQuery } from '@redux/RTKQuery';
import { LessonRecommendRes } from './types';
import { AxiosResponse } from 'axios';

export const authQuery = baseQuery.injectEndpoints({
  endpoints: builder => ({
    getLessonRecommend: builder.query<LessonRecommendRes, void>({
      query: () => '/lesson/recommend',
      transformResponse: (res: AxiosResponse<LessonRecommendRes>) => res.data,
    }),
  }),
  overrideExisting: true,
});
