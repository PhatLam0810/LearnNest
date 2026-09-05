import React from 'react';
import { View } from 'react-native-web';
import { useRouter } from 'next/navigation';
import { useAppPagination } from '@hooks';
import { useAppDispatch } from '@redux';
import { LessonItem } from '~mdDashboard/components';
import { dashboardAction } from '~mdDashboard/redux';
import styles from './styles';

const PREVIEW_PAGE_SIZE = 8;

type AllCoursesGridProps = {
  enrolledIds: Set<string>;
};

// Xem trước "Tất cả khóa học" ngay trên Trang Chủ - trước khi tách sang
// dashboard cá nhân hóa, Trang Chủ có 1 lưới catalog đầy đủ; giờ mang lại
// bản rút gọn (PREVIEW_PAGE_SIZE khóa mới nhất) bên dưới "Đang học". Catalog
// đầy đủ (lọc/tìm kiếm/phân trang) vẫn ở /dashboard/lesson, không lặp logic
// đó ở đây - chỉ 1 lần fetch trang đầu.
const AllCoursesGrid: React.FC<AllCoursesGridProps> = ({ enrolledIds }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { listItem, isLoading } = useAppPagination<any>({
    apiUrl: 'lesson/getAllLesson',
    params: { pageSize: PREVIEW_PAGE_SIZE },
  });

  if (isLoading && listItem.length === 0) {
    return (
      <View style={styles.grid}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={styles.cardSkeleton} />
        ))}
      </View>
    );
  }

  if (!listItem.length) return null;

  return (
    <View style={styles.grid}>
      {listItem.slice(0, PREVIEW_PAGE_SIZE).map(item => (
        <LessonItem
          key={item._id}
          data={{ ...item, isInProgress: enrolledIds.has(item._id) }}
          onClick={() => {
            dispatch(dashboardAction.getLessonDetail({ id: item._id }));
            router.push(`/dashboard/home/lesson/${item._id}`);
          }}
        />
      ))}
    </View>
  );
};

export default AllCoursesGrid;
