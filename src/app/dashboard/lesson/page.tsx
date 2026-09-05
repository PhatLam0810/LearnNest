'use client';
import { useAppPagination } from '@hooks';
import { useMyCourses } from '@hooks/useMyCourses';
import { FlatList, Text, View } from 'react-native-web';
import { LessonItem } from '~mdDashboard/components';
import styles from './styles';
import './styles.scss';
import { dashboardAction, dashboardQuery } from '~mdDashboard/redux';
import { useAppDispatch, useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import { UpdateLessonForm } from './_components';
import { useEffect, useMemo, useState } from 'react';
import { useResponsive } from '@/styles/responsive';
import { useSearchContext } from '@components/SearchContext';

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { keyword, sortBy } = useSearchContext();

  const { isMobile, isTablet } = useResponsive();
  const numColumns = isMobile ? 1 : isTablet ? 2 : 4;

  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { data: categories } = dashboardQuery.useGetAllCategoryQuery();
  const { myCourses } = useMyCourses(userProfile?._id || null);
  const enrolledIds = useMemo(
    () => new Set(myCourses.map(c => c.lessonId)),
    [myCourses],
  );

  // 'all' | 'in-progress' | <categoryId>
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const { listItem, fetchData, changeParams, currentData } =
    useAppPagination<any>({
      apiUrl: 'lesson/getAllLesson',
      isLazy: true,
    });
  const [isVisible, setIsVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();

  useEffect(() => {
    const filter =
      activeFilter !== 'all' && activeFilter !== 'in-progress'
        ? { categories: activeFilter }
        : undefined;
    changeParams({ search: keyword, sortBy, filter });
  }, [keyword, sortBy, activeFilter]);

  // "Đang học" lọc trên danh sách đã tải — số khóa đang học của 1 người
  // thường nhỏ nên không cần thêm 1 API lọc theo server riêng.
  const displayItems =
    activeFilter === 'in-progress'
      ? listItem.filter((item: any) => enrolledIds.has(item._id))
      : listItem;

  const lessonItemStyle = {
    ...styles.lessonItem,
    maxWidth: isMobile ? '100%' : isTablet ? '48%' : '24%',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Khóa Học</Text>
        <Text style={styles.pageSubtitle}>
          {currentData?.totalRecords ?? listItem.length} khóa học
        </Text>
      </View>

      <View style={styles.filterRow}>
        <View
          onClick={() => setActiveFilter('all')}
          style={
            activeFilter === 'all' ? styles.filterPillActive : styles.filterPill
          }>
          <Text
            style={
              activeFilter === 'all'
                ? styles.filterPillTextActive
                : styles.filterPillText
            }>
            Tất cả
          </Text>
        </View>
        {categories?.map(cat => (
          <View
            key={cat._id}
            onClick={() => setActiveFilter(cat._id)}
            style={
              activeFilter === cat._id
                ? styles.filterPillActive
                : styles.filterPill
            }>
            <Text
              style={
                activeFilter === cat._id
                  ? styles.filterPillTextActive
                  : styles.filterPillText
              }>
              {cat.name}
            </Text>
          </View>
        ))}
        <View
          onClick={() => setActiveFilter('in-progress')}
          style={
            activeFilter === 'in-progress'
              ? styles.filterPillActive
              : styles.filterPill
          }>
          <Text
            style={
              activeFilter === 'in-progress'
                ? styles.filterPillTextActive
                : styles.filterPillText
            }>
            Đang học
          </Text>
        </View>
      </View>

      <FlatList
        key={numColumns} // Force re-render when numColumns changes
        data={displayItems}
        stickyHeaderHiddenOnScroll
        keyExtractor={(item, index) => item._id + index}
        numColumns={numColumns}
        contentContainerStyle={{
          gap: isMobile ? 12 : 16,
          paddingBottom: 48,
          paddingTop: 4,
          overflow: 'visible',
        }}
        columnWrapperStyle={
          numColumns > 1 ? { gap: isMobile ? 12 : 16 } : undefined
        }
        showsVerticalScrollIndicator={false}
        onEndReached={activeFilter === 'in-progress' ? undefined : fetchData}
        renderItem={({ item }) => {
          return (
            <LessonItem
              key={item._id}
              data={{ ...item, isInProgress: enrolledIds.has(item._id) }}
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
