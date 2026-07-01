import React from 'react';
import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../styles';

type PracticeClassUserItem = {
  userId: string;
  fullName: string;
  email: string;
  status?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  dataSource: PracticeClassUserItem[];
  total: number;
  onExport: () => void;
};

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

const PracticeClassUsersModal: React.FC<Props> = ({
  open,
  onClose,
  loading,
  dataSource,
  total,
  onExport,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Danh Sách Người Trong Lớp Thực Hành"
      width={900}
      footer={null}>
      <div style={styles.modalContentWrap}>
        <div style={styles.modalToolbar}>
          <div style={styles.modalSummaryText}>Tổng số: {total}</div>
          <button
            type="button"
            onClick={onExport}
            style={styles.exportButtonStyle}>
            Xuất Excel
          </button>
        </div>
        <Table
          columns={learnerColumns}
          dataSource={dataSource}
          rowKey="userId"
          loading={loading}
          pagination={false}
          locale={{ emptyText: 'Không có người dùng' }}
        />
      </div>
    </Modal>
  );
};

export default PracticeClassUsersModal;
