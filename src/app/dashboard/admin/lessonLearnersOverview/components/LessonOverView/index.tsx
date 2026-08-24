'use client';
import React from 'react';
import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { adminQuery } from '~mdAdmin/redux';
import { LessonLearnersSummary } from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import { LessonOverviewTable } from './_component';

type StatCardProps = {
  icon: string;
  label: string;
  value: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="course-overview__stat-card">
    <div className="course-overview__stat-icon">{icon}</div>
    <div className="course-overview__stat-body">
      <div className="course-overview__stat-label">{label}</div>
      <div className="course-overview__stat-value">{value}</div>
    </div>
    <div className="course-overview__stat-accent" />
  </div>
);

const LessonLearnersOverview: React.FC = () => {
  const router = useRouter();
  const { data: summaryData, isLoading: summaryLoading } =
    adminQuery.useGetLessonLearnersSummaryQuery();

  const handleLessonSelect = (record: LessonLearnersSummary) => {
    router.push(`/dashboard/admin/lessonLearnersOverview/${record._id}`);
  };

  return (
    <div className="course-overview">
      <div className="course-overview__stats">
        <StatCard
          icon="📚"
          label="Tổng Khóa Học"
          value={summaryData?.items.length ?? 0}
        />
        <StatCard
          icon="👥"
          label="Tổng Người Học"
          value={summaryData?.totalLearners ?? 0}
        />
        <StatCard
          icon="✓"
          label="Tỉ Lệ Hoàn Thành TB"
          value={`${(summaryData?.totalRate ?? 0).toFixed(1)}%`}
        />
      </div>

      <div className="course-overview__section">
        <h2 className="course-overview__title">Khóa học học thuật gần đây</h2>
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
