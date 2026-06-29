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
  Select,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminQuery } from '~mdAdmin/redux';
import {
  LessonLearnersSummary,
  LessonLearner,
} from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';
import styles from './styles';
import { useAppPagination } from '@hooks/pagination';
import { message } from 'antd';

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
    useState<LessonLearnersSummary>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { Search } = Input;

  // Query summary data
  const { data: summaryData, isLoading: summaryLoading } =
    adminQuery.useGetLessonLearnersSummaryQuery();
  const [exportLearner] = adminQuery.useExportLearnersMutation();
  // Query learners for selected lesson

  useEffect(() => {
    if (selectedLessonOverview) {
      fetchData();
      refresh();
    }
  }, [selectedLessonOverview]);
  const { listItem: listTag, search: searchTag } = useAppPagination<any>({
    apiUrl: 'tag/getAll',
  });
  const { listItem, fetchData, refresh, search, currentData, filter } =
    useAppPagination<LessonLearner>({
      apiUrl: `admin/lessons/${selectedLessonOverview?._id}/learners`,
      isLazy: true,
    });

  const lessonColumns: ColumnsType<LessonLearnersSummary> = [
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
        <Badge count={value} style={styles.badgeSuccessStyle} />
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
      title: 'Trạng thái',
      dataIndex: 'isCompleted', // Phải khớp với key trong dữ liệu
      key: 'isCompleted',
      width: '15%',
      align: 'center',
      render: (isCompleted: boolean) => (
        <Badge
          status={isCompleted ? 'success' : 'error'}
          style={{ color: isCompleted ? 'green' : 'red' }}
          text={isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
        />
      ),
    },
  ];

  const handleLessonSelect = async (record: LessonLearnersSummary) => {
    setSelectedLessonOverview(record);
    setIsModalVisible(true);
  };

  const handleExportExcel = async () => {
    if (!listItem || listItem.length === 0) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }

    setIsExporting(true);
    try {
      const response = await exportLearner({ learners: listItem });

      // Tạo link download
      const blob = response.data;
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `${selectedLessonOverview?.title}_${timestamp}.xlsx`;
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
    setSelectedLessonOverview(null);
  };
  return (
    <div className="lesson-learners-overview">
      {/* Summary Stats */}
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

      {/* Lesson Summary Table */}
      <div className="lesson-learners-overview__section">
        <h2 className="lesson-learners-overview__title">Tổng Quan Khóa Học</h2>
        <Spin spinning={summaryLoading}>
          <Table
            className="lesson-learners-overview__table"
            columns={lessonColumns}
            dataSource={summaryData?.items}
            rowKey="key"
            onChange={res => {
              fetchData({ pageNum: res.current });
            }}
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
        title={`Danh Sách Người Học: ${selectedLessonOverview?.title}`}
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
            <Space size="large" style={{ marginBottom: 20, width: '100%' }}>
              <Statistic
                title="Tổng Người Học"
                value={currentData?.totalRecords}
              />
              <Statistic
                title="Đã Hoàn Thành"
                value={currentData?.totalCompleted}
                valueStyle={{ color: '#3f8600' }}
              />
              <Statistic
                title="Tỉ Lệ Hoàn Thành"
                value={`${currentData?.completionRate}%`}
                valueStyle={{ color: '#3f8600' }}
              />
              <Statistic
                title="Chưa Hoàn Thành"
                value={currentData?.totalNotCompleted}
                valueStyle={{ color: '#cf1322' }}
              />
              <Statistic
                title="Tỉ Lệ Chưa Hoàn Thành"
                value={`${currentData?.notCompletionRate}%`}
                valueStyle={{ color: '#cf1322' }}
              />
            </Space>
          </div>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn mã lớp học"
            allowClear
            onChange={(value: string) => {
              if (value) {
                filter({ class: value });
              }
              filter(null);
            }}>
            {listTag?.map(item => (
              <Select.Option key={item._id} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <Search
            placeholder="Tìm kiếm"
            onSearch={search}
            style={styles.searchInput}
          />
          <Table
            columns={learnerColumns}
            dataSource={listItem}
            rowKey="key"
            onChange={res => {
              fetchData({ pageNum: res.current });
            }}
            pagination={{
              current: currentData?.pageNum,
              total: currentData?.totalRecords,
              pageSize: currentData?.pageSize,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
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
