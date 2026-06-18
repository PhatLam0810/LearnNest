'use client';
import React, { useMemo, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Empty,
  Spin,
  Badge,
  Space,
  Statistic,
  Card,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { View, Text } from 'react-native-web';
import { adminQuery } from '~mdAdmin/redux';
import {
  LessonLearnersSummary,
  LessonLearner,
} from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';

type LessonWithStatus = LessonLearnersSummary & {
  key: string;
};

type LearnerTableData = LessonLearner & {
  key: string;
};

const LessonLearnersOverview = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Query summary data
  const { data: summaryData, isLoading: summaryLoading } =
    adminQuery.useGetLessonLearnersSummaryQuery();

  // Query learners for selected lesson
  const { data: learnersData, isLoading: learnersLoading } =
    adminQuery.useGetLessonLearnersQuery(selectedLessonId!, {
      skip: !selectedLessonId,
    });

  // Transform lesson summary to table format
  const lessonTableData: LessonWithStatus[] = useMemo(
    () =>
      summaryData?.data?.map(lesson => ({
        ...lesson,
        key: lesson._id,
      })) || [],
    [summaryData],
  );

  // Transform learner data to table format
  const learnerTableData: LearnerTableData[] = useMemo(
    () =>
      learnersData?.learners?.map((learner, idx) => ({
        ...learner,
        key: `${learner.userId}-${idx}`,
      })) || [],
    [learnersData],
  );

  // Lesson Summary Columns
  const lessonColumns: ColumnsType<LessonWithStatus> = [
    {
      title: 'Tên Khóa Học',
      dataIndex: 'title',
      key: 'title',
      width: '50%',
    },
    {
      title: 'Tổng Số Người Học',
      dataIndex: 'totalLearners',
      key: 'totalLearners',
      width: '25%',
      align: 'center',
      render: (value: number) => (
        <Badge
          count={value}
          style={{ backgroundColor: '#52c41a', fontSize: '14px' }}
        />
      ),
    },
    {
      title: 'Tỉ Lệ Hoàn Thành',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: '25%',
      align: 'center',
      render: (value: number) => `${value.toFixed(1)}%`,
    },
  ];

  // Learner Columns
  const learnerColumns: ColumnsType<LearnerTableData> = [
    {
      title: 'Họ và Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '20%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'studentId',
      key: 'studentId',
      width: '15%',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      width: '15%',
    },
    {
      title: 'Ngành',
      dataIndex: 'major',
      key: 'major',
      width: '15%',
    },
    {
      title: 'Hoàn Thành',
      dataIndex: 'isCompleted',
      key: 'isCompleted',
      width: '15%',
      align: 'center',
      render: (value: boolean) => (
        <Badge
          status={value ? 'success' : 'processing'}
          text={value ? 'Đạt' : 'Chưa Đạt'}
        />
      ),
    },
  ];

  const handleLessonSelect = (record: LessonWithStatus) => {
    setSelectedLessonId(record._id);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedLessonId(null);
  };

  return (
    <div className="lesson-learners-overview">
      {/* Summary Stats */}
      <div className="lesson-learners-overview__stats">
        <Space wrap>
          <Card className="lesson-learners-overview__stat-card">
            <Statistic
              title="Tổng Khóa Học"
              value={lessonTableData.length}
              prefix="📚"
            />
          </Card>
          <Card className="lesson-learners-overview__stat-card">
            <Statistic
              title="Tổng Người Học (Toàn Bộ)"
              value={lessonTableData.reduce(
                (sum, l) => sum + l.totalLearners,
                0,
              )}
              prefix="👥"
            />
          </Card>
          <Card className="lesson-learners-overview__stat-card">
            <Statistic
              title="Tỉ Lệ Hoàn Thành TB"
              value={
                lessonTableData.length > 0
                  ? (
                      lessonTableData.reduce(
                        (sum, l) => sum + l.completionRate,
                        0,
                      ) / lessonTableData.length
                    ).toFixed(1)
                  : 0
              }
              suffix="%"
              prefix="✓"
            />
          </Card>
        </Space>
      </div>

      {/* Lesson Summary Table */}
      <div className="lesson-learners-overview__section">
        <h2 className="lesson-learners-overview__title">Tổng Quan Khóa Học</h2>
        <Spin spinning={summaryLoading}>
          <Table
            className="lesson-learners-overview__table"
            columns={lessonColumns}
            dataSource={lessonTableData}
            rowKey="key"
            pagination={{ pageSize: 10 }}
            onRow={record => ({
              onClick: () => handleLessonSelect(record),
              className: 'lesson-learners-overview__table-row-clickable',
            })}
            locale={{
              emptyText: <Empty description="Không có dữ liệu khóa học" />,
            }}
          />
        </Spin>
      </div>

      {/* Learners Modal */}
      <Modal
        title={`Danh Sách Người Học: ${learnersData?.lessonTitle || ''}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        width="90%"
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}>
        <Spin spinning={learnersLoading}>
          {learnersData ? (
            <>
              <div className="lesson-learners-overview__modal-stats">
                <Space>
                  <Statistic
                    title="Tổng Người Học"
                    value={learnersData.totalLearners}
                    size="small"
                  />
                  <Statistic
                    title="Đã Hoàn Thành"
                    value={learnerTableData.filter(l => l.isCompleted).length}
                    size="small"
                  />
                </Space>
              </div>
              <Table
                columns={learnerColumns}
                dataSource={learnerTableData}
                rowKey="key"
                pagination={{ pageSize: 20 }}
                size="small"
                locale={{
                  emptyText: <Empty description="Không có người học" />,
                }}
              />
            </>
          ) : null}
        </Spin>
      </Modal>
    </div>
  );
};

export default LessonLearnersOverview;
