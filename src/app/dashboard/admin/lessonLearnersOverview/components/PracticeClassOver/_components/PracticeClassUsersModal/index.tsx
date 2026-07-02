import React, { useEffect } from 'react';
import { Button, Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './styles';
import { useAppPagination } from '@hooks/pagination';

type PracticeClassUserItem = {
  userId: string;
  fullName: string;
  email: string;
  status?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  selectedPracticeClassId: string;
  onExport: (practiceUsers: PracticeClassUserItem[]) => void;
};

const PracticeClassUsersModal: React.FC<Props> = ({
  open,
  onClose,
  selectedPracticeClassId,
  onExport,
}) => {
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<PracticeClassUserItem>({
      apiUrl: `admin/practice-classes/${selectedPracticeClassId}/users`,
    });

  useEffect(() => {
    if (open && selectedPracticeClassId) {
      fetchData();
      refresh();
    }
  }, [open, selectedPracticeClassId]);

  const learnerColumns: ColumnsType<PracticeClassUserItem> = [
    {
      title: 'Tên Người Dùng',
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
      title: 'Khoa',
      dataIndex: 'faculty',
      key: 'faculty',
      width: '15%',
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Danh Sách Người Trong Lớp Thực Hành"
      width={'80%'}
      footer={null}>
      <div style={styles.modalContentWrap}>
        <div style={styles.modalToolbar}>
          <div style={styles.modalSummaryText}>
            Tổng số: {currentData?.totalRecords}
          </div>
          <Button
            key="export"
            type="primary"
            onClick={() => onExport(listItem)}>
            Tải Excel
          </Button>
          ,
        </div>
        <Table
          columns={learnerColumns}
          dataSource={listItem}
          rowKey="userId"
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
          locale={{ emptyText: 'Không có người dùng' }}
        />
      </div>
    </Modal>
  );
};

export default PracticeClassUsersModal;
