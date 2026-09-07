'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { dashboardQuery } from '~mdDashboard/redux';
import { NotificationItem } from '~mdDashboard/redux/RTKQuery/types';
import styles from './styles';

// Trang "Tất Cả Thông Báo" - liệt kê đầy đủ thông báo của tài khoản đang
// đăng nhập (chung cho cả User lẫn Admin, chỉ khác nội dung theo vai trò
// người nhận, giống chuông ở HeaderLayout). Chuông chỉ hiện 10 thông báo mới
// nhất + nút "Xem tất cả" dẫn tới đây - phần chi tiết/phân trang đầy đủ dồn
// hết về trang này.
const NotificationsPage: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { data } = dashboardQuery.useGetNotificationsQuery({ page, limit });
  const [markNotificationRead] =
    dashboardQuery.useMarkNotificationReadMutation();

  const handleRowClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await markNotificationRead(item._id).unwrap();
      } catch {}
    }
    if (item.link) router.push(item.link);
  };

  const columns: TableProps<NotificationItem>['columns'] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (_: unknown, r: NotificationItem) => (
        <View style={{ gap: 2 }}>
          <Text style={{ fontWeight: r.isRead ? 400 : 700, fontSize: 14 }}>
            {r.title}
          </Text>
          {!!r.body && (
            <Text style={{ color: '#8D8D8D', fontSize: 13 }}>{r.body}</Text>
          )}
        </View>
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
      <Text style={styles.title}>Tất Cả Thông Báo</Text>

      <Table
        columns={columns}
        dataSource={data?.items}
        rowKey={r => r._id}
        scroll={{ x: 'max-content' }}
        onRow={r => ({
          onClick: () => handleRowClick(r),
          style: { cursor: 'pointer' },
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

export default NotificationsPage;
