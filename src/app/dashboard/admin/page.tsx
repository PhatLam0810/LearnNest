'use client';
import React, { useEffect, useState } from 'react';
import { Badge, ConfigProvider } from 'antd';
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
import QuizManagePage from './quizManage/page';
import SubmissionsManage from './submissionsManage/page';
import PracticeClassManage from './practiceClassManage/page';
import OverviewManage from './overviewManage/page';
import { ADMIN_PRIMARY } from './adminTheme';
import motion from '@/styles/motion';

type TabItem = {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
};

// Thứ tự tab theo luồng làm việc của admin (đọc từ trên xuống): tổng quan ->
// người dùng -> lớp -> khóa học -> giao/làm bài -> hỗ trợ -> nhật ký.
const buildItems = (qnaPendingCount: number): TabItem[] => [
  { key: '0', label: 'Tổng Quan', children: <OverviewManage /> },
  { key: '1', label: 'Quản Trị Người Dùng', children: <UserManage /> },
  { key: '2', label: 'Tạo Người Dùng', children: <ImportUserManage /> },
  { key: '14', label: 'Lớp Học', children: <PracticeClassManage /> },
  { key: '3', label: 'Tạo Khóa Học', children: <LessonAdmin /> },
  {
    key: '4',
    label: 'Tổng Quan Người Học',
    children: <LessonLearnersOverview />,
  },
  { key: '11', label: 'Giao Bài', children: <GiaoBaiPage /> },
  { key: '12', label: 'Tạo Bài Tập', children: <QuizManagePage /> },
  { key: '13', label: 'Bài Nộp Học Viên', children: <SubmissionsManage /> },
  { key: '10', label: 'Đề Thi Thử', children: <MockExamManage /> },
  { key: '9', label: 'Báo Cáo Ngưỡng Đạt', children: <PassRateReport /> },
  {
    key: '8',
    label: (
      <Badge count={qnaPendingCount} size="default" offset={[8, -2]}>
        <View style={styles.subTitle}>Hộp Thư Hỏi Đáp</View>
      </Badge>
    ),
    children: <QaInbox />,
  },
  { key: '5', label: 'Phản Hồi Người Dùng', children: <FeedbackManage /> },
  { key: '6', label: 'Nhật Ký Thao Tác', children: <AuditLogManage /> },
  { key: '7', label: 'Báo Cáo Vi Phạm', children: <CommentReportsManage /> },
];

const AdminPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || '1'; // Tab đang mở lấy từ URL, mặc định '1'
  // Tab đã mở giữ nguyên mounted (ẩn/hiện) như antd Tabs cũ để không mất state.
  const [visited, setVisited] = useState<string[]>([tab]);
  useEffect(() => {
    setVisited(prev => (prev.includes(tab) ? prev : [...prev, tab]));
  }, [tab]);
  const selectTab = (key: string) =>
    router.replace(`/dashboard/admin?tab=${key}`, { scroll: false });
  const [qnaPendingCount, setQnaPendingCount] = useState(0);

  useEffect(() => {
    getQuestionStatsApi()
      .then(stats => setQnaPendingCount(stats?.openCount ?? 0))
      .catch(() => {});
  }, []);

  const items = buildItems(qnaPendingCount);

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
          {/* Thanh tab xuống dòng thay vì gom vào menu "...": mọi tab luôn
              hiện, không cuộn ngang. */}
          <div role="tablist" style={styles.tabStrip as React.CSSProperties}>
            {items.map(item => (
              <button
                key={item.key}
                type="button"
                role="tab"
                id={`admin-tab-${item.key}`}
                aria-selected={tab === item.key}
                aria-controls={`admin-pane-${item.key}`}
                onClick={() => selectTab(item.key)}
                style={
                  (tab === item.key
                    ? { ...styles.tab, ...styles.tabActive }
                    : styles.tab) as React.CSSProperties
                }>
                {item.label}
              </button>
            ))}
          </div>
          {items
            .filter(item => visited.includes(item.key))
            .map(item => (
              <div
                key={item.key}
                role="tabpanel"
                id={`admin-pane-${item.key}`}
                aria-labelledby={`admin-tab-${item.key}`}
                hidden={tab !== item.key}
                style={
                  tab === item.key
                    ? (motion.routeEnter as React.CSSProperties)
                    : undefined
                }>
                {item.children}
              </div>
            ))}
        </View>
      </div>
    </ConfigProvider>
  );
};

export default AdminPage;
