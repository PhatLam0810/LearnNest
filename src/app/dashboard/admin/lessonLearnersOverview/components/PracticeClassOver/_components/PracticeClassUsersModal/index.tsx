import React from 'react';
import { Modal, Table } from 'antd';
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
  const {
    listItem: practiceUsersList,
    currentData: practiceUsersCurrent,
    fetchData: fetchPracticeUsers,
    refresh: refreshPracticeUsers,
    search: searchPracticeUsers,
  } = useAppPagination<PracticeClassUserItem>({
    apiUrl: `admin/practice-classes/${selectedPracticeClassId}/users`,
    isLazy: true,
  });

  const learnerColumns: ColumnsType<PracticeClassUserItem> = [
    {
      title: 'Tên Người Dùng',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '35%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '35%',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: '30%',
      render: (value?: string) => value || 'Chưa cập nhật',
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Danh Sách Người Trong Lớp Thực Hành"
      width={900}
      footer={null}>
      <div style={styles.modalContentWrap}>
        <div style={styles.modalToolbar}>
          <div style={styles.modalSummaryText}>Tổng số: </div>
          <button
            type="button"
            // onClick={() => onExport(dataSource)}
            style={styles.exportButtonStyle}>
            Xuất Excel
          </button>
        </div>
        {/* <Table
          columns={learnerColumns}
          dataSource={dataSource}
          rowKey="userId"
          pagination={false}
          locale={{ emptyText: 'Không có người dùng' }}
        /> */}
      </div>
    </Modal>
  );
};

export default PracticeClassUsersModal;
