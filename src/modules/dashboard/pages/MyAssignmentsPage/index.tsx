'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Empty, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { dashboardQuery } from '~mdDashboard/redux';
import './styles.scss';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const STATUS_TAG: Record<
  'not_submitted' | 'passed' | 'failed',
  { color: string; label: string }
> = {
  passed: { color: 'success', label: 'Đã đạt' },
  failed: { color: 'error', label: 'Chưa đạt' },
  not_submitted: { color: 'default', label: 'Chưa nộp' },
};

const MyAssignmentsPage: React.FC = () => {
  const router = useRouter();
  const { data, isFetching } = dashboardQuery.useGetMyAssignmentsQuery();

  if (isFetching && !data) {
    return (
      <div className="my-assignments-center">
        <Spin />
      </div>
    );
  }

  const items = data || [];

  return (
    <div className="my-assignments-page">
      <h1 className="my-assignments-heading">Bài được giao</h1>
      <p className="my-assignments-sub">
        Các bài thực hành được giáo viên giao cho lớp bạn tham gia, kèm hạn nộp.
      </p>

      {items.length === 0 ? (
        <Empty description="Bạn chưa được giao bài nào." />
      ) : (
        <div className="my-assignments-list">
          {items.map(a => {
            const tag = STATUS_TAG[a.status];
            return (
              <div
                key={a.assignmentId}
                className={
                  'my-assignments-item' +
                  (a.isOverdue ? ' my-assignments-item--overdue' : '')
                }
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/dashboard/practice/${a.taskId}`)}>
                <div className="my-assignments-item-head">
                  <Tag color={tag.color}>{tag.label}</Tag>
                  {a.isOverdue && <Tag color="warning">Quá hạn</Tag>}
                  {a.className && (
                    <span className="my-assignments-class">{a.className}</span>
                  )}
                  <span className="my-assignments-due">
                    Hạn nộp: {dayjs(a.dueDate).format('DD/MM/YYYY HH:mm')}
                  </span>
                </div>
                <div className="my-assignments-title">
                  {a.taskTitle}{' '}
                  <Tag color={a.subject === 'Excel' ? 'green' : 'blue'}>
                    {a.subject}
                  </Tag>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAssignmentsPage;
