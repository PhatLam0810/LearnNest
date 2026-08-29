'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import PracticeTaskContent from '~mdDashboard/components/PracticeTaskContent';
import './styles.scss';

type Props = { taskId: string };

// Trang đứng riêng cho 1 bài tập chưa gắn vào khóa thực hành nào (không có
// lessonId) — bài đã gắn vào khóa thì học viên làm ngay trong trang khóa
// thực hành (sidebar Phần > Bài tập), không cần trang này.
const PracticeTaskDetailPage: React.FC<Props> = ({ taskId }) => {
  const router = useRouter();

  return (
    <div className="practice-detail-page">
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={() => router.push('/dashboard/practice')}>
        Quay lại
      </Button>
      <PracticeTaskContent taskId={taskId} />
    </div>
  );
};

export default PracticeTaskDetailPage;
