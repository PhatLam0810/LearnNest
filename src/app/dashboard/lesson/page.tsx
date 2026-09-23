'use client';
import { useAppPagination } from '@hooks';
import { FlatList, Text, View } from 'react-native-web';
import { LessonItem } from '~mdDashboard/components';
import MyClassCourses from '~mdDashboard/components/MyClassCourses';
import styles from './styles';
import './styles.scss';
import { dashboardQuery } from '~mdDashboard/redux';
import { useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useResponsive } from '@/styles/responsive';
import { useSearchContext } from '@components/SearchContext';
import { asButton } from '@/utils/asButton';
import { BookOpenOutlined } from '@components/AppIcon';
import CourseListSkeleton from './_components/CourseListSkeleton';

const Page = () => {
  const router = useRouter();

  const { keyword, sortBy } = useSearchContext();

  const { isMobile, isTablet } = useResponsive();
  const numColumns = isMobile ? 1 : isTablet ? 2 : 4;

  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const { data: categories } = dashboardQuery.useGetAllCategoryQuery();
  const { data: bookmarkedLessonIds } =
    dashboardQuery.useGetBookmarkIdsQuery('lesson');
  const { data: myCourses } = dashboardQuery.useGetMyCoursesQuery(
    userProfile?._id || '',
    { skip: !userProfile?._id },
  );
  const enrolledIds = useMemo(
    () => new Set((myCourses || []).map(c => c.lessonId)),
    [myCourses],
  );

  // 'all' | 'in-progress' | <categoryId>
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const { listItem, fetchData, changeParams, currentData, isLoading } =
    useAppPagination<any>({
      apiUrl: 'lesson/getAllLesson',
      isLazy: true,
    });

  useEffect(() => {
    const filter =
      activeFilter !== 'all' && activeFilter !== 'in-progress'
        ? { categories: activeFilter }
        : undefined;
    changeParams({ search: keyword, sortBy, filter });
  }, [keyword, sortBy, activeFilter]);

  // "Đang học" lọc trên danh sách đã tải
  const displayItems =
    activeFilter === 'in-progress'
      ? listItem.filter((item: any) => enrolledIds.has(item._id))
      : listItem;

  const lessonItemStyle = {
    ...styles.lessonItem,
    maxWidth: isMobile ? '100%' : isTablet ? '48%' : '24%',
  };

  const isInitialLoading = isLoading && listItem.length === 0;

  return (
    <View style={styles.container}>
      <MyClassCourses />
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Khóa Học</Text>
        <Text style={styles.pageSubtitle}>
          {currentData?.totalRecords ?? listItem.length} khóa học có sẵn trên
          LearnNest
        </Text>
      </View>

      <View
        style={styles.filterRow}
        role="tablist"
        aria-label="Bộ lọc danh mục khóa học">
        <View
          {...asButton(() => setActiveFilter('all'), 'Xem tất cả khóa học')}
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
            {...asButton(
              () => setActiveFilter(cat._id),
              `Lọc khóa học theo danh mục ${cat.name}`,
            )}
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
          {...asButton(
            () => setActiveFilter('in-progress'),
            'Xem khóa học đang học',
          )}
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

      {/* Trạng thái 1: Loading Skeleton */}
      {isInitialLoading ? (
        <CourseListSkeleton />
      ) : displayItems.length === 0 ? (
        /* Trạng thái 2: Empty State */
        <View style={styles.emptyContainer} aria-label="Không có khóa học nào">
          <View style={styles.emptyIconWrapper}>
            <BookOpenOutlined
              size={32}
              color="var(--color-vhu-primary)"
              hoverMorph={false}
            />
          </View>
          <Text style={styles.emptyTitle}>Chưa tìm thấy khóa học phù hợp</Text>
          <Text style={styles.emptyDesc}>
            {keyword
              ? `Không có kết quả nào khớp với từ khóa "${keyword}". Hãy thử tìm kiếm bằng từ khóa khác hoặc đặt lại bộ lọc.`
              : activeFilter === 'in-progress'
                ? 'Bạn chưa tham gia khóa học nào. Hãy khám phá danh sách khóa học và bắt đầu học ngay hôm nay!'
                : 'Hiện tại chưa có khóa học trong danh mục này. Vui lòng quay lại sau!'}
          </Text>
          {(activeFilter !== 'all' || keyword) && (
            <View
              style={styles.emptyActionBtn}
              {...asButton(() => setActiveFilter('all'), 'Xem tất cả khóa học')}
              onClick={() => setActiveFilter('all')}>
              <Text style={styles.emptyActionText}>Xem tất cả khóa học</Text>
            </View>
          )}
        </View>
      ) : (
        /* Trạng thái 3: Populated Course Grid */
        <FlatList
          key={numColumns}
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
                showBookmark
                bookmarked={(bookmarkedLessonIds || []).includes(item._id)}
                onClick={() => {
                  router.push(`home/lesson/${item._id}`);
                }}
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default Page;
