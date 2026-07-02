'use client';
import React, { useState } from 'react';
import { Card, Space, Spin, Statistic, message } from 'antd';
import { adminQuery } from '~mdAdmin/redux';
import { useAppPagination } from '@hooks';
import {
  PracticeClassItem,
  PracticeClassUserItem,
} from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import PracticeClassOverview from './_components/PracticeClassOverview';
import PracticeClassUsersModal from './_components/PracticeClassUsersModal';

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
    <div className="lesson-learners-overview">
      <div className="lesson-learners-overview__stats">
        <Space wrap>
          <Card className="lesson-learners-overview__stat-card">
            <Statistic
              title="Tổng Khóa Học"
              value={practiceCurrent?.totalRecords}
              prefix="📚"
            />
          </Card>
          <Card className="lesson-learners-overview__stat-card">
            <Statistic
              title="Tổng Người Học (Toàn Bộ)"
              value={totalPracticeLearners}
              prefix="👥"
            />
          </Card>
        </Space>
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
