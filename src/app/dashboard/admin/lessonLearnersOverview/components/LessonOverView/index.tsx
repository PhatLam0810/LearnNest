'use client';
import React from 'react';
import { Card, Space, Spin, Statistic } from 'antd';
import { useRouter } from 'next/navigation';
import { adminQuery } from '~mdAdmin/redux';
import { LessonLearnersSummary } from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import { LessonOverviewTable } from './_component';

const LessonLearnersOverview: React.FC = () => {
  const router = useRouter();
  const { data: summaryData, isLoading: summaryLoading } =
    adminQuery.useGetLessonLearnersSummaryQuery();

  const handleLessonSelect = (record: LessonLearnersSummary) => {
    router.push(`/dashboard/admin/lessonLearnersOverview/${record._id}`);
  };

  return (
    <div className="lesson-learners-overview">
      <div className="lesson-learners-overview__stats">
        <Space wrap>
          <Card className="lesson-learners-overview__stat-card">
            <Statistic
              title="Tổng Khóa Học"
              value={summaryData?.items.length}
              prefix="📚"
            />
          </Card>
          <Card className="lesson-learners-overview__stat-card">
            <Statistic
              title="Tổng Người Học (Toàn Bộ)"
              value={summaryData?.totalLearners}
              prefix="👥"
            />
          </Card>
          <Card className="lesson-learners-overview__stat-card">
            <Statistic
              title="Tỉ Lệ Hoàn Thành TB"
              value={summaryData?.totalRate}
              suffix="%"
              prefix="✓"
            />
          </Card>
        </Space>
      </div>

      <div className="lesson-learners-overview__section">
        <h2 className="lesson-learners-overview__title">Tổng Quan Khóa Học</h2>
        <Spin spinning={summaryLoading}>
          <LessonOverviewTable
            dataSource={summaryData?.items || []}
            loading={summaryLoading}
            onSelectLesson={handleLessonSelect}
          />
        </Spin>
      </div>
    </div>
  );
};

export default LessonLearnersOverview;
