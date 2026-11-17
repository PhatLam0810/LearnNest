'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from 'antd';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  BarChartOutlined,
  BookOpenOutlined,
  CarryOutOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  DollarOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  FireOutlined,
  IdcardOutlined,
  MailOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@components/AppIcon';
import { adminQuery } from '~mdAdmin/redux';
import './adminNav.css';

export const ADMIN_DEFAULT_TAB = '0';
const QA_TAB = '8';

// `tab` khớp key trong admin/page.tsx - link cũ dạng ?tab=13 vẫn chạy.
export const ADMIN_NAV = [
  {
    label: 'Hệ thống & điều hành',
    items: [
      { tab: '0', label: 'Tổng Quan', Icon: BarChartOutlined },
      { tab: '1', label: 'Quản Trị Người Dùng', Icon: TeamOutlined },
      { tab: '2', label: 'Tạo / Nhập Người Dùng', Icon: UserOutlined },
      { tab: '14', label: 'Lớp Học Thực Hành', Icon: IdcardOutlined },
    ],
  },
  {
    label: 'Quản lý đào tạo',
    items: [
      { tab: '3', label: 'Khóa Học & Bài Giảng', Icon: BookOpenOutlined },
      { tab: '13', label: 'Bài Nộp & Chấm Điểm', Icon: FileTextOutlined },
    ],
  },
  {
    // Mọi thứ liên quan trang Luyện tập của học viên: MOS (thực hành, thi thử)
    // và các mục trắc nghiệm ABCD (AI, ...).
    label: 'Luyện tập',
    items: [
      { tab: '11', label: 'Giao Đề Thực Hành (MOS)', Icon: CarryOutOutlined },
      { tab: '10', label: 'Đề Thi Thử MOS', Icon: ExperimentOutlined },
      {
        tab: '12',
        label: 'Trắc Nghiệm ABCD & Ngân Hàng Câu Hỏi',
        Icon: QuestionCircleOutlined,
      },
    ],
  },
  {
    label: 'Thống kê & báo cáo',
    items: [
      { tab: '4', label: 'Tổng Quan Người Học', Icon: TrophyOutlined },
      { tab: '9', label: 'Báo Cáo Ngưỡng Đạt', Icon: BarChartOutlined },
      { tab: '15', label: 'Doanh Thu & Premium', Icon: DollarOutlined },
    ],
  },
  {
    label: 'Hỗ trợ & giám sát',
    items: [
      { tab: QA_TAB, label: 'Hộp Thư Hỏi Đáp', Icon: MailOutlined },
      { tab: '5', label: 'Phản Hồi Học Viên', Icon: CommentOutlined },
      { tab: '7', label: 'Báo Cáo Vi Phạm', Icon: FireOutlined },
      { tab: '6', label: 'Nhật Ký Thao Tác', Icon: ClockCircleOutlined },
    ],
  },
];

export const DEFAULT_TITLE = 'Quản Trị Hệ Thống';
export const adminTabLabel = (tab: string) =>
  ADMIN_NAV.flatMap(g => g.items).find(i => i.tab === tab)?.label ??
  DEFAULT_TITLE;

type Props = { collapsed?: boolean; onNavigate?: () => void };

const AdminNav: React.FC<Props> = ({ collapsed = false, onNavigate }) => {
  const pathname = usePathname();
  const tab = useSearchParams().get('tab') || ADMIN_DEFAULT_TAB;
  const activeTab = pathname === '/dashboard/admin' ? tab : null;
  const [closed, setClosed] = useState<string[]>([]);
  // Dùng chung cache với tab Hộp thư: trả lời xong là huy hiệu tự cập nhật.
  const { data: qnaStats } = adminQuery.useGetQuestionStatsQuery();
  const qnaPending = qnaStats?.openCount ?? 0;

  return (
    <nav
      aria-label="Điều hướng quản trị"
      className={`admin-nav${collapsed ? ' admin-nav--collapsed' : ''}`}>
      {ADMIN_NAV.map(group => {
        const isOpen = collapsed || !closed.includes(group.label);
        return (
          <div key={group.label} className="admin-nav__section">
            {collapsed ? (
              <hr className="admin-nav__divider" />
            ) : (
              <button
                type="button"
                className="admin-nav__group"
                aria-expanded={isOpen}
                onClick={() =>
                  setClosed(prev =>
                    isOpen
                      ? [...prev, group.label]
                      : prev.filter(l => l !== group.label),
                  )
                }>
                {group.label}
                <RightOutlined
                  size={14}
                  hoverMorph={false}
                  className="admin-nav__chevron"
                />
              </button>
            )}
            {isOpen && (
              <ul className="admin-nav__list">
                {group.items.map(({ tab: key, label, Icon }) => (
                  <li key={key}>
                    <Link
                      href={`/dashboard/admin?tab=${key}`}
                      scroll={false}
                      className="admin-nav__item"
                      aria-current={activeTab === key ? 'page' : undefined}
                      aria-label={collapsed ? label : undefined}
                      title={collapsed ? label : undefined}
                      onClick={onNavigate}>
                      <Icon size={18} hoverMorph={false} />
                      {!collapsed && (
                        <span className="admin-nav__label">{label}</span>
                      )}
                      {key === QA_TAB && qnaPending > 0 && (
                        <Badge
                          count={qnaPending}
                          size="small"
                          dot={collapsed}
                          className="admin-nav__badge"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default AdminNav;
