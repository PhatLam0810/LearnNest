'use client';
import React, { useEffect, useState } from 'react';
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
  Dropdown,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FilterOutlined } from '@ant-design/icons';
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
  const [tempFilters, setTempFilters] = useState<any>();
  const [open, setOpen] = useState(false);
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
  const { listItem: listTag } = useAppPagination<any>({
    apiUrl: 'tag/getAll',
  });
  const {
    listItem,
    fetchData,
    refresh,
    search,
    currentData,
    filter,
    changeParams,
  } = useAppPagination<LessonLearner>({
    apiUrl: `admin/lessons/${selectedLessonOverview?._id}/learners`,
    isLazy: true,
  });
  console.log(currentData);
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
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '15%',
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
      title: 'Khoa',
      dataIndex: 'faculty',
      key: 'faculty',
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
    changeParams({ isFull: true });
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

  const FilterDropdown = ({ onFilterChange }) => {
    const handleApply = () => {
      onFilterChange(tempFilters);
      setOpen(false);
    };

    const handleReset = () => {
      setTempFilters({}); // Reset về object rỗng thay vì null
      onFilterChange({});
      setOpen(false);
    };

    const content = () => (
      <div
        onClick={e => e.stopPropagation()}
        style={{
          padding: 16,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: 250,
        }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ fontWeight: 'bold' }}>Bộ lọc tìm kiếm</div>

          <Select
            style={{ width: '100%' }}
            placeholder="Chọn mã lớp học"
            allowClear
            value={tempFilters?.class}
            onChange={val => setTempFilters(prev => ({ ...prev, class: val }))}>
            {listTag?.map(item => (
              <Select.Option key={item._id} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: '100%' }}
            value={tempFilters?.isCompleted}
            onChange={val =>
              setTempFilters(prev => ({ ...prev, isCompleted: val }))
            }>
            <Select.Option value={true}>Hoàn thành</Select.Option>
            <Select.Option value={false}>Chưa hoàn thành</Select.Option>
          </Select>

          <Divider style={{ margin: '8px 0' }} />

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={handleReset}>Thiết lập lại</Button>
            <Button type="primary" onClick={handleApply}>
              Áp dụng
            </Button>
          </Space>
        </Space>
      </div>
    );

    return (
      <Dropdown
        open={open}
        trigger={['click']}
        onOpenChange={setOpen}
        popupRender={content}>
        <Button icon={<FilterOutlined />}>Lọc</Button>
      </Dropdown>
    );
  };
  const handleFilterSubmit = filters => {
    filter(filters);
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
                value={`${currentData?.notCompletionRate || 0}%`}
                valueStyle={{ color: '#cf1322' }}
              />
            </Space>
          </div>
          <div style={styles.searchInputContainer}>
            <Search
              placeholder="Tìm kiếm"
              onSearch={search}
              style={styles.searchInput}
            />
            <FilterDropdown onFilterChange={handleFilterSubmit} />
          </div>
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
