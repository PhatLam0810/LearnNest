'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
  Input,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { View, Text } from 'react-native-web';
import { adminQuery } from '~mdAdmin/redux';
import {
  LessonLearnersSummary,
  LessonLearner,
} from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import { useAppPagination } from '@hooks/pagination';
import { message } from 'antd';
import axios from 'axios';
import { useAppSelector } from '@redux';

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

type LessonWithStatus = LessonLearnersSummary & {
  key: string;
};

type LearnerTableData = LessonLearner & {
  key: string;
};

const LessonLearnersOverview = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<any>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { Search } = Input;
  const { accessToken } =
    useAppSelector(state => state.authReducer.tokenInfo || {}) || {};
  // Query summary data
  const { data: summaryData, isLoading: summaryLoading } =
    adminQuery.useGetLessonLearnersSummaryQuery();

  // Query learners for selected lesson

  useEffect(() => {
    if (selectedLessonId) {
      fetchData();
    }
  }, [selectedLessonId]);

  const { listItem, fetchData, refresh, search } =
    useAppPagination<LessonLearner>({
      apiUrl: `admin/lessons/${selectedLessonId}/learners`,
    });
  // `admin/lessons/${lessonId}/learners`
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
  const learnerColumns: ColumnsType<LessonLearner> = [
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
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      align: 'center',
      render: (value: string) => (
        <Badge
          status={value === 'Đạt' ? 'success' : 'processing'}
          text={value}
        />
      ),
    },
  ];

  const handleLessonSelect = async (record: LessonWithStatus) => {
    console.log('Selected Lesson:', record);
    setSelectedLessonId(record._id);
    setSelectedLessonTitle(record.title);
    setIsModalVisible(true);
  };

  const handleExportExcel = async () => {
    if (!listItem || listItem.length === 0) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }

    setIsExporting(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.post(
        `${baseURL}/admin/export-learners`,
        { learners: listItem },
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // Tạo link download
      const blob = response.data;
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${selectedLessonTitle}_${timestamp}.xlsx`;
      downloadFile(blob, fileName);

      message.success('Tải file thành công!');
    } catch (error) {
      console.error('Lỗi export:', error);
      message.error('Lỗi khi tải file. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
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
        title={`Danh Sách Người Học: ${selectedLessonTitle}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        width="90%"
        footer={[
          <Button
            key="export"
            type="primary"
            loading={isExporting}
            onClick={handleExportExcel}>
            Tải Excel
          </Button>,
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}>
        <>
          <div className="lesson-learners-overview__modal-stats">
            <Space>
              <Statistic title="Tổng Người Học" value={listItem.length} />
              <Statistic
                title="Đã Hoàn Thành"
                value={listItem.filter(l => l.status === 'Đạt').length}
              />
            </Space>
          </div>
          <Search
            placeholder="Input search text"
            onSearch={search}
            style={{ width: '100%' }}
          />
          <Table
            columns={learnerColumns}
            dataSource={listItem}
            rowKey="key"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="Không có người học" />,
            }}
          />
        </>
      </Modal>
    </div>
  );
};

export default LessonLearnersOverview;
