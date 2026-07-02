import React, { useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Input,
  Space,
  Badge,
  Empty,
  Button,
  Statistic,
  Select,
  Divider,
  Dropdown,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LessonLearner } from '~mdAdmin/redux/RTKQuery/type';
import { FilterOutlined } from '@ant-design/icons';
import styles from '../../styles';
import { useAppPagination } from '@hooks/pagination';

type Props = {
  open: boolean;
  onClose: () => void;
  selectedLessonOverview: any;
  onExport: (listItem: LessonLearner[]) => void;
  onCreatePracticeClass: (listItem: LessonLearner[]) => void;
};

const LessonLearnersModal: React.FC<Props> = ({
  open,
  selectedLessonOverview,
  onClose,
  onExport,
  onCreatePracticeClass,
}) => {
  const { Search } = Input;
  const [tempFilters, setTempFilters] = useState<any>();
  const [openFilter, setOpenFilter] = useState(false);
  const { listItem: listTag, fetchData: fetchTagData } = useAppPagination<any>({
    apiUrl: 'tag/getAll',
    isLazy: false,
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
  useEffect(() => {
    if (selectedLessonOverview) {
      fetchData();
      refresh();
    }
  }, [selectedLessonOverview]);

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
  const FilterDropdown = ({ onFilterChange }) => {
    const handleApply = () => {
      onFilterChange(tempFilters);
      setOpenFilter(false);
    };

    const handleReset = () => {
      setTempFilters({}); // Reset về object rỗng thay vì null
      onFilterChange({});
      setOpenFilter(false);
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
        open={openFilter}
        trigger={['click']}
        onOpenChange={setOpenFilter}
        popupRender={content}>
        <Button icon={<FilterOutlined />}>Lọc</Button>
      </Dropdown>
    );
  };
  const handleFilterSubmit = filters => {
    filter(filters);
  };
  return (
    <Modal
      title={`Danh Sách Người Học: ${selectedLessonOverview?.title}`}
      open={open}
      onCancel={onClose}
      width="90%"
      footer={[
        <Button key="export" type="primary" onClick={() => onExport(listItem)}>
          Tải Excel
        </Button>,
        <Button
          key="export"
          type="primary"
          onClick={() => onCreatePracticeClass(listItem)}>
          Tạo Lớp Thực Hành
        </Button>,
        <Button key="close" onClick={onClose}>
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
  );
};

export default LessonLearnersModal;
