'use client';
import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { View } from 'react-native-web';
import { typography } from '@styles';
import styles from './styles';
import './styles.scss';
import { useSearchParams } from 'next/navigation';
import { ADMIN_DEFAULT_TAB, adminTabLabel, DEFAULT_TITLE } from './AdminNav';
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
import PremiumManage from './premiumManage/page';
import { ADMIN_PRIMARY } from './adminTheme';
import motion from '@/styles/motion';

// Nhãn + nhóm của từng mục nằm ở AdminNav (thanh bên); ở đây chỉ map key ->
// màn hình. Key giữ nguyên số cũ để các link ?tab=13... đã có vẫn chạy.
const PANES: Record<string, React.ReactNode> = {
  '0': <OverviewManage />,
  '1': <UserManage />,
  '2': <ImportUserManage />,
  '14': <PracticeClassManage />,
  '3': <LessonAdmin />,
  '4': <LessonLearnersOverview />,
  // '11': <GiaoBaiPage />,
  // '12': <QuizManagePage />,
  '13': <SubmissionsManage />,
  '10': <MockExamManage />,
  '15': <PremiumManage />,
  '9': <PassRateReport />,
  '8': <QaInbox />,
  '5': <FeedbackManage />,
  '6': <AuditLogManage />,
  '7': <CommentReportsManage />,
};

const AdminPage: React.FC = () => {
  const param = useSearchParams().get('tab') || ADMIN_DEFAULT_TAB;
  // Mục có trong thanh bên nhưng đã bị tắt khỏi PANES (vd Giao Bài, Ngân Hàng
  // Câu Hỏi): báo "tạm tắt" thay vì lặng lẽ nhảy sang Tổng Quan.
  const isDisabled =
    !(param in PANES) && adminTabLabel(param) !== DEFAULT_TITLE;
  const tab = param in PANES || isDisabled ? param : ADMIN_DEFAULT_TAB;
  // Mục đã mở giữ nguyên mounted (ẩn/hiện) để không mất state khi đổi mục.
  const [visited, setVisited] = useState<string[]>([tab]);
  useEffect(() => {
    setVisited(prev => (prev.includes(tab) ? prev : [...prev, tab]));
  }, [tab]);

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
            <h1 style={styles.pageTitle}>{adminTabLabel(tab)}</h1>
          </View>
          {isDisabled && (
            <p role="status" style={styles.disabledNote}>
              Chức năng này đang tạm tắt.
            </p>
          )}
          {visited
            .filter(key => key in PANES)
            .map(key => (
              <section
                key={key}
                aria-label={adminTabLabel(key)}
                hidden={tab !== key}
                style={
                  tab === key
                    ? (motion.routeEnter as React.CSSProperties)
                    : undefined
                }>
                {PANES[key]}
              </section>
            ))}
        </View>
      </div>
    </ConfigProvider>
  );
};

export default AdminPage;
