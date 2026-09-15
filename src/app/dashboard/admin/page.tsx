'use client';
import React, { useEffect, useState } from 'react';
import { Badge, ConfigProvider, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { View } from 'react-native-web';
import { typography } from '@styles';
import styles from './styles';
import './styles.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { getQuestionStatsApi } from '~mdAdmin/services/api';
import UserManage from './userManage/page';
import ImportUserManage from './userManage/components/ImportUserManage';
import LessonAdmin from './lessonManage/page';
import LessonLearnersOverview from './lessonLearnersOverview';
import GiaoBaiPage from './giaoBai/page';
import FeedbackManage from './feedbackManage/page';
import AuditLogManage from './auditLogManage/page';
import CommentReportsManage from './commentReportsManage/page';
import QaInbox from './qaInbox/page';
import PassRateReport from './passRateReport/page';
import MockExamManage from './mockExamManage/page';
import { ADMIN_PRIMARY } from './adminTheme';

const buildItems = (qnaPendingCount: number): TabsProps['items'] => [
  {
    key: '1',
    label: 'Quản Trị Người Dùng',
    children: <UserManage />,
  },
  {
    key: '2',
    label: 'Tạo Người Dùng',
    children: <ImportUserManage />,
  },
  {
    key: '3',
    label: 'Tạo Khóa Học',
    children: <LessonAdmin />,
  },
  {
    key: '4',
    label: 'Tổng Quan Người Học',
    children: <LessonLearnersOverview />,
  },
  {
    key: '11',
    label: 'Giao Bài',
    children: <GiaoBaiPage />,
  },
  {
    key: '5',
    label: 'Phản Hồi Người Dùng',
    children: <FeedbackManage />,
  },
  {
    key: '6',
    label: 'Nhật Ký Thao Tác',
    children: <AuditLogManage />,
  },
  {
    key: '7',
    label: 'Báo Cáo Vi Phạm',
    children: <CommentReportsManage />,
  },
  {
    key: '8',
    label: (
      <Badge count={qnaPendingCount} size="default" offset={[8, -2]}>
        <View style={styles.subTitle}>Hộp Thư Hỏi Đáp</View>
      </Badge>
    ),
    children: <QaInbox />,
  },
  {
    key: '9',
    label: 'Báo Cáo Ngưỡng Đạt',
    children: <PassRateReport />,
  },
  {
    key: '10',
    label: 'Đề Thi Thử',
    children: <MockExamManage />,
  },
];

const AdminPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || '1'; // Lấy `tab` từ URL, mặc định là '1'
  const [qnaPendingCount, setQnaPendingCount] = useState(0);

  useEffect(() => {
    getQuestionStatsApi()
      .then(stats => setQnaPendingCount(stats?.openCount ?? 0))
      .catch(() => {});
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: ADMIN_PRIMARY,
          colorInfo: ADMIN_PRIMARY,
          borderRadius: 10,
          // antd tự set font-family riêng cho từng component (Tag, Select,
          // Table, Input...), GHI ĐÈ font Lexend kế thừa từ body - phải khai
          // báo lại ở đây thì toàn bộ chữ trong khu Quản Trị mới đúng Lexend
          // (đã xác minh: .ant-tag trước đó vẫn dùng font hệ thống mặc định
          // dù <body> đã set Lexend).
          fontFamily: typography.body2.fontFamily,
        },
        components: {
          // Nút lọc trạng thái đang chọn (Hộp Thư Hỏi Đáp) nền navy thương
          // hiệu, chữ trắng - mặc định Segmented dùng nền xám.
          Segmented: {
            itemSelectedBg: ADMIN_PRIMARY,
            itemSelectedColor: '#fff',
          },
        },
      }}>
      <div className="admin-page">
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <h1 style={styles.pageTitle}>Quản Trị Hệ Thống</h1>
          </View>
          <Tabs defaultActiveKey={tab} items={buildItems(qnaPendingCount)} />
        </View>
      </div>
    </ConfigProvider>
  );
};

export default AdminPage;
