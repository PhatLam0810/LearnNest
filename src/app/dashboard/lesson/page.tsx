'use client';
import { useAppPagination } from '@hooks';
import { FlatList, ScrollView, Text, View } from 'react-native-web';
import { LessonItem } from '~mdDashboard/components';
import styles from './styles';
import './styles.css';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { useAppDispatch, useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import { UpdateLessonForm } from './_components';
import { useEffect, useState } from 'react';
import { useLessonSearchContext } from './lessonSearchContext';

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { keyword, sortBy } = useLessonSearchContext();

  const { listItem, fetchData, changeParams } = useAppPagination<any>({
    apiUrl: 'lesson/getAllLesson',
    isLazy: true,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();

  const { data } = dashboardQuery.useGetAllCategoryQuery();

  useEffect(() => {
    changeParams({ search: keyword, sortBy });
  }, [keyword, sortBy]);

  return (
    <View style={styles.container}>
      <FlatList
        data={listItem}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item, index) => item._id + index}
        numColumns={4}
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 48,
          overflow: 'visible',
        }}
        columnWrapperStyle={{ gap: 16 }}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchData}
        renderItem={({ item }) => {
          return (
            <LessonItem
              key={item._id}
              data={item}
              style={styles.lessonItem}
              onClick={() => {
                dispatch(dashboardAction.getLessonDetail({ id: item._id }));
                router.push(`home/lesson/${item._id}`);
              }}
            />
          );
        }}
      />
      <UpdateLessonForm
        data={dataEdit}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </View>
  );
};

export default Page;
