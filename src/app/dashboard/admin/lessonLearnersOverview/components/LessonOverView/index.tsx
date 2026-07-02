'use client';
import React, { useState } from 'react';
import { Card, Space, Spin, Statistic, message } from 'antd';
import { adminQuery } from '~mdAdmin/redux';
import {
  LessonLearner,
  LessonLearnersSummary,
} from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import {
  CreatePracticeClassModal,
  LessonLearnersModal,
  LessonOverviewTable,
} from './_component';

const LessonLearnersOverview: React.FC = () => {
  const [selectedLessonOverview, setSelectedLessonOverview] =
    useState<LessonLearnersSummary | null>(null);
  const [isLearnersModalVisible, setIsLearnersModalVisible] = useState(false);
  useState(false);

  const [isCreatePracticeModalVisible, setIsCreatePracticeModalVisible] =
    useState(false);
  const { data: summaryData, isLoading: summaryLoading } =
    adminQuery.useGetLessonLearnersSummaryQuery();

  const [exportLearners] = adminQuery.useExportLearnersMutation();

  const handleLessonSelect = (record: LessonLearnersSummary) => {
    setSelectedLessonOverview(record);
    setIsLearnersModalVisible(true);
  };

  const handleLearnersModalClose = () => {
    setIsLearnersModalVisible(false);
    setSelectedLessonOverview(null);
  };

  const handlePracticeCreated = async () => {
    setIsCreatePracticeModalVisible(true);
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
        onCreatePracticeClass={handlePracticeCreated}
      />

      <CreatePracticeClassModal
        open={isCreatePracticeModalVisible}
        onClose={() => setIsCreatePracticeModalVisible(false)}
        lessonId={selectedLessonOverview?._id}
        onCreated={handlePracticeCreated}
      />
    </div>
  );
};

export default LessonLearnersOverview;
