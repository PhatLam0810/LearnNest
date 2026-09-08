'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Select, Table, TableProps, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@redux';
import { useMyCourses } from '@/hooks/useMyCourses';
import { dashboardQuery } from '~mdDashboard/redux';
import { RecentTestResult } from '~mdDashboard/redux/RTKQuery/types';
import styles from './styles';

const scoreStyle = (score: number) => {
  if (score >= 8) return styles.scoreGood;
  if (score >= 5) return styles.scoreOk;
  return styles.scoreBad;
};

// Trang "Toàn bộ lịch sử kiểm tra" - widget "Kết quả bài kiểm tra" ở trang
// Tổng Quan chỉ hiện 3 mục gần nhất + nút "Xem tất cả" dẫn tới đây. Bấm vào
// 1 dòng (nếu có link - xem LessonService.getMergedResults) sẽ điều hướng
// thẳng tới bài đó để làm lại, giống hành vi trang thông báo.
const ResultsPage: React.FC = () => {
  const router = useRouter();
  const userId = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile?._id,
  );
  const { myCourses } = useMyCourses(userId || null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState<
    'quiz' | 'practice' | 'mock_exam' | undefined
  >(undefined);
  const [isPass, setIsPass] = useState<boolean | undefined>(undefined);
  const [lessonId, setLessonId] = useState<string | undefined>(undefined);

  const { data, isFetching } = dashboardQuery.useGetMyResultsQuery(
    { userId: userId || '', page, limit, type, isPass, lessonId },
    { skip: !userId },
  );

  // Đổi filter thì luôn quay về trang 1 - giữ nguyên page cũ dễ ra trang
  // trống nếu kết quả lọc được ít hơn.
  const resetToFirstPage = () => setPage(1);

  const handleRowClick = (item: RecentTestResult) => {
    if (item.link) router.push(item.link);
  };

  const columns: TableProps<RecentTestResult>['columns'] = [
    {
      title: 'Tên bài',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, r: RecentTestResult) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14 }}>{r.name}</Text>
          <Tag
            color={
              r.type === 'practice'
                ? 'orange'
                : r.type === 'mock_exam'
                  ? 'purple'
                  : 'blue'
            }>
            {r.type === 'practice'
              ? 'Bài tập'
              : r.type === 'mock_exam'
                ? 'Thi thử'
                : 'Trắc nghiệm'}
          </Tag>
        </View>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (_: unknown, r: RecentTestResult) => (
        <Text style={[styles.scoreCell, scoreStyle(r.score)]}>
          {r.score.toFixed(1)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPass',
      key: 'isPass',
      width: 130,
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'error'}>{v ? 'Đạt' : 'Chưa đạt'}</Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (v: string) => <Text>{dayjs(v).format('DD/MM/YYYY HH:mm')}</Text>,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toàn Bộ Lịch Sử Kiểm Tra</Text>

      <View style={styles.filterRow}>
        <Select
          allowClear
          placeholder="Loại bài"
          style={{ width: 160 }}
          value={type}
          onChange={v => {
            setType(v);
            resetToFirstPage();
          }}
          options={[
            { value: 'quiz', label: 'Trắc nghiệm' },
            { value: 'practice', label: 'Bài tập' },
            { value: 'mock_exam', label: 'Thi thử' },
          ]}
        />
        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 160 }}
          value={isPass}
          onChange={v => {
            setIsPass(v);
            resetToFirstPage();
          }}
          options={[
            { value: true, label: 'Đạt' },
            { value: false, label: 'Chưa đạt' },
          ]}
        />
        <Select
          allowClear
          showSearch
          placeholder="Khóa học"
          style={{ width: 240 }}
          value={lessonId}
          onChange={v => {
            setLessonId(v);
            resetToFirstPage();
          }}
          optionFilterProp="label"
          options={myCourses
            .filter(c => c && c.lessonId)
            .map(c => ({
              value: c.lessonId,
              label: c.lessonName || 'Khóa học đang cập nhật...',
            }))}
        />
      </View>

      <Table
        loading={isFetching}
        columns={columns}
        dataSource={data?.items}
        rowKey={r => r._id}
        scroll={{ x: 'max-content' }}
        onRow={r => ({
          onClick: () => handleRowClick(r),
          style: { cursor: r.link ? 'pointer' : 'default' },
        })}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.total,
          simple: true,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          onChange: (p, ps) => {
            setPage(p);
            setLimit(ps);
          },
        }}
      />
    </View>
  );
};

export default ResultsPage;
