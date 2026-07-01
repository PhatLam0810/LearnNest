'use client';
import React, { useEffect, useState } from 'react';
import { Card, Space, Spin, Statistic, message } from 'antd';
import { adminQuery } from '~mdAdmin/redux';
import {
  LessonLearner,
  LessonLearnersSummary,
  PracticeClassItem,
  PracticeClassUserItem,
} from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import { useAppPagination } from '@hooks/pagination';
import LessonOverviewTable from './components/LessonOverviewTable';
import LessonLearnersModal from './components/LessonLearnersModal';
import PracticeClassOverview from './components/PracticeClassOverview';
import PracticeClassUsersModal from './components/PracticeClassUsersModal';

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

const LessonLearnersOverview = () => {
  const [selectedLessonOverview, setSelectedLessonOverview] =
    useState<LessonLearnersSummary | null>(null);
  const [isLearnersModalVisible, setIsLearnersModalVisible] = useState(false);
  const [isPracticeModalVisible, setIsPracticeModalVisible] = useState(false);
  const [selectedPracticeClass, setSelectedPracticeClass] =
    useState<PracticeClassItem | null>(null);
  const [practiceClasses, setPracticeClasses] = useState<PracticeClassItem[]>(
    [],
  );
  const [practiceUsers, setPracticeUsers] = useState<PracticeClassUserItem[]>(
    [],
  );
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceUsersLoading, setPracticeUsersLoading] = useState(false);

  const { data: summaryData, isLoading: summaryLoading } =
    adminQuery.useGetLessonLearnersSummaryQuery();
  const [exportLearners] = adminQuery.useExportLearnersMutation();
  const [getPracticeClasses] = adminQuery.useLazyGetPracticeClassesQuery();
  const [getPracticeClassUsers] =
    adminQuery.useLazyGetPracticeClassUsersQuery();

  const handleLessonSelect = (record: LessonLearnersSummary) => {
    setSelectedLessonOverview(record);
    setIsLearnersModalVisible(true);
  };

  const handleLearnersModalClose = () => {
    setIsLearnersModalVisible(false);
    setSelectedLessonOverview(null);
  };

  const handleExportExcel = async (listItem: LessonLearner[]) => {
    if (!listItem.length) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }

    try {
      const blob = await exportLearners({ learners: listItem }).unwrap();
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${selectedLessonOverview?.title || 'learners'}_${timestamp}.xlsx`;
      downloadFile(blob, fileName);
      message.success('Tải file thành công!');
    } catch (error) {
      console.error('Lỗi export:', error);
      message.error('Lỗi khi tải file. Vui lòng thử lại.');
    }
  };

  const handleSelectPracticeClass = async (record: PracticeClassItem) => {
    setSelectedPracticeClass(record);
    setIsPracticeModalVisible(true);
    setPracticeUsersLoading(true);

    try {
      const response = await getPracticeClassUsers(record._id);
      const items = response?.data?.items || [];
      setPracticeUsers(items);
    } catch (error) {
      console.error('Failed to load practice class users', error);
      setPracticeUsers([]);
    } finally {
      setPracticeUsersLoading(false);
    }
  };

  const handlePracticeModalClose = () => {
    setIsPracticeModalVisible(false);
    setSelectedPracticeClass(null);
    setPracticeUsers([]);
  };

  const handlePracticeExport = async () => {
    if (!practiceUsers.length) {
      message.warning('Không có dữ liệu người dùng để xuất');
      return;
    }

    try {
      const blob = await exportLearners({ learners: practiceUsers }).unwrap();
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${selectedPracticeClass?.className || 'practice-class'}_${timestamp}.xlsx`;
      downloadFile(blob, fileName);
      message.success('Tải file thành công!');
    } catch (error) {
      console.error('Lỗi export practice class:', error);
      message.error('Lỗi khi tải file. Vui lòng thử lại.');
    }
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

      <LessonLearnersModal
        open={isLearnersModalVisible}
        onClose={handleLearnersModalClose}
        selectedLessonOverview={selectedLessonOverview}
        onExport={handleExportExcel}
      />

      <div className="lesson-learners-overview__section">
        <PracticeClassOverview
          dataSource={practiceClasses}
          loading={practiceLoading}
          onSelectClass={handleSelectPracticeClass}
        />
      </div>

      <PracticeClassUsersModal
        open={isPracticeModalVisible}
        onClose={handlePracticeModalClose}
        loading={practiceUsersLoading}
        dataSource={practiceUsers}
        total={practiceUsers.length}
        onExport={handlePracticeExport}
      />
    </div>
  );
};

export default LessonLearnersOverview;
