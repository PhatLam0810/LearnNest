'use client';
import React, { useState } from 'react';
import { message } from 'antd';
import { adminQuery } from '~mdAdmin/redux';
import { useAppPagination } from '@hooks';
import {
  PracticeClassItem,
  PracticeClassUserItem,
} from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import PracticeClassOverview from './_components/PracticeClassOverview';
import PracticeClassUsersModal from './_components/PracticeClassUsersModal';

type StatCardProps = {
  icon: string;
  label: string;
  value: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="practice-overview__stat-card">
    <div className="practice-overview__stat-icon">{icon}</div>
    <div className="practice-overview__stat-body">
      <div className="practice-overview__stat-label">{label}</div>
      <div className="practice-overview__stat-value">{value}</div>
    </div>
    <div className="practice-overview__stat-accent" />
  </div>
);

const LessonLearnersOverview: React.FC = () => {
  const [isPracticeModalVisible, setIsPracticeModalVisible] = useState(false);

  const [selectedPracticeClass, setSelectedPracticeClass] =
    useState<PracticeClassItem | null>(null);

  const {
    listItem: practiceData,
    currentData: practiceCurrent,
    refresh: refetchPracticeClasses,
    fetchData: fetchPracticeClasses,
  } = useAppPagination<any>({
    apiUrl: `/admin/practice-classes`,
  });
  const [exportLearners] = adminQuery.useExportLearnersMutation();

  const handleSelectPracticeClass = async (record: PracticeClassItem) => {
    setSelectedPracticeClass(record);
    setIsPracticeModalVisible(true);
  };

  const handlePracticeModalClose = () => {
    setIsPracticeModalVisible(false);
    setSelectedPracticeClass(null);
  };

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handlePracticeExport = async (
    practiceUsersList: PracticeClassUserItem[],
  ) => {
    if (!practiceUsersList.length) {
      message.warning('Không có dữ liệu người dùng để xuất');
      return;
    }

    try {
      const blob = await exportLearners({
        learners: practiceUsersList,
      }).unwrap();
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${selectedPracticeClass?.className || 'practice-class'}_${timestamp}.xlsx`;
      downloadFile(blob, fileName);
      message.success('Tải file thành công!');
    } catch (error) {
      console.error('Lỗi export practice class:', error);
      message.error('Lỗi khi tải file. Vui lòng thử lại.');
    }
  };
  const totalPracticeLearners = practiceData
    .map(item => item.count)
    .reduce((acc, curr) => acc + (curr || 0), 0);
  return (
    <div className="practice-overview">
      <div className="practice-overview__stats">
        <StatCard
          icon="📚"
          label="Tổng Lớp Thực Hành"
          value={practiceCurrent?.totalRecords ?? 0}
        />
        <StatCard
          icon="👥"
          label="Tổng Người Học (Toàn Bộ)"
          value={totalPracticeLearners}
        />
      </div>
      <PracticeClassOverview
        dataSource={practiceData || []}
        onSelectClass={handleSelectPracticeClass}
      />

      <PracticeClassUsersModal
        open={isPracticeModalVisible}
        onClose={handlePracticeModalClose}
        selectedPracticeClassId={selectedPracticeClass?._id}
        onExport={handlePracticeExport}
      />
    </div>
  );
};

export default LessonLearnersOverview;
