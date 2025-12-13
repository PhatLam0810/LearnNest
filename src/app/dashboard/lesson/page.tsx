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
import { useResponsive } from '@/styles/responsive';

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { keyword, sortBy } = useLessonSearchContext();

  // Responsive hook
  const { isMobile, isTablet } = useResponsive();
  const numColumns = isMobile ? 1 : isTablet ? 2 : 4;

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

  // Responsive container styles
  const containerStyle = {
    ...styles.container,
    padding: isMobile ? 12 : isTablet ? 16 : 20,
  };

  // Responsive lesson item styles
  const lessonItemStyle = {
    ...styles.lessonItem,
    maxWidth: isMobile ? '100%' : isTablet ? '48%' : '24%',
  };

  return (
    <View style={containerStyle}>
      <FlatList
        key={numColumns} // Force re-render when numColumns changes
        data={listItem}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item, index) => item._id + index}
        numColumns={numColumns}
        contentContainerStyle={{
          gap: isMobile ? 12 : 16,
          paddingBottom: 48,
          overflow: 'visible',
        }}
        columnWrapperStyle={
          numColumns > 1 ? { gap: isMobile ? 12 : 16 } : undefined
        }
        showsVerticalScrollIndicator={false}
        onEndReached={fetchData}
        renderItem={({ item }) => {
          return (
            <LessonItem
              key={item._id}
              data={item}
              style={lessonItemStyle}
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
