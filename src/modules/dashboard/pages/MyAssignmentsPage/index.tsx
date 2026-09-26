'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Empty, Result, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { dashboardQuery } from '~mdDashboard/redux';
import { asButton } from '@/utils/asButton';
import type { MyAssignmentItem } from '~mdDashboard/redux/RTKQuery/types';
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

const TYPE_LABEL: Record<MyAssignmentItem['assignmentType'], string> = {
  practice: 'Bài thực hành',
  quiz: 'Bài tập trắc nghiệm',
  mockExam: 'Đề thi thử',
};

// Mỗi loại bài giao mở đúng màn của nó (trước đây luôn mở /practice/<taskId>
// nên quiz/thi thử bị đưa tới /practice/null). null = chưa dựng được link
// (quiz mồ côi, không nằm trong khóa nào) -> hàng không bấm được.
const assignmentHref = (a: MyAssignmentItem): string | null => {
  if (a.assignmentType === 'quiz') {
    return a.lessonId && a.quizId
      ? `/dashboard/home/lesson/moduleDetail?lessonId=${a.lessonId}&subLessonId=${a.quizId}`
      : null;
  }
  if (a.assignmentType === 'mockExam') return '/dashboard/mock-exam';
  return a.taskId ? `/dashboard/practice/${a.taskId}` : null;
};

const MyAssignmentsPage: React.FC = () => {
  const router = useRouter();
  const { data, isFetching, isError, refetch } =
    dashboardQuery.useGetMyAssignmentsQuery();

  if (isFetching && !data) {
    return (
      <div className="my-assignments-center">
        <Spin />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="my-assignments-center">
        <Result
          status="warning"
          title="Không tải được bài được giao"
          extra={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      </div>
    );
  }

  const items = data || [];

  return (
    <div className="my-assignments-page">
      <h1 className="my-assignments-heading">Bài được giao</h1>
      <p className="my-assignments-sub">
        Các bài thực hành, bài trắc nghiệm và đề thi thử được giáo viên giao cho
        lớp bạn tham gia, kèm hạn nộp.
      </p>

      {items.length === 0 ? (
        <Empty description="Bạn chưa được giao bài nào." />
      ) : (
        <div className="my-assignments-list">
          {items.map(a => {
            const tag = STATUS_TAG[a.status];
            const href = assignmentHref(a);
            return (
              <div
                key={a.assignmentId}
                className={
                  'my-assignments-item' +
                  (a.isOverdue ? ' my-assignments-item--overdue' : '')
                }
                {...(href
                  ? {
                      ...asButton(() => router.push(href), a.taskTitle),
                      onClick: () => router.push(href),
                    }
                  : {})}>
                <div className="my-assignments-item-head">
                  <Tag color={tag.color}>{tag.label}</Tag>
                  {a.isLate && <Tag color="warning">Nộp trễ</Tag>}
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
                    {a.subject ?? TYPE_LABEL[a.assignmentType]}
                  </Tag>
                  {a.subject && a.assignmentType !== 'practice' && (
                    <Tag>{TYPE_LABEL[a.assignmentType]}</Tag>
                  )}
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
