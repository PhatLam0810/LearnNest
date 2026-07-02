import React from 'react';
import { Badge, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../../styles';
import type {
  PracticeClassItem,
  PracticeClassListResponse,
} from '~mdAdmin/redux/RTKQuery/type';
import dayjs from 'dayjs';

type Props = {
  dataSource?: PracticeClassItem[];
  loading?: boolean;
  onSelectClass: (record: PracticeClassItem) => void;
};

const PracticeClassOverview: React.FC<Props> = ({
  dataSource = [],
  loading,
  onSelectClass,
}) => {
  const practiceColumns: ColumnsType<PracticeClassItem> = [
    {
      title: 'Tên Lớp Thực Hành',
      dataIndex: 'practiceClassName',
      key: 'practiceClassName',
      width: '45%',
      render: (_value, record) =>
        record.practiceClassName || record.className || '—',
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '25%',
      render: (value?: string) => (
        <div>{dayjs(value).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      title: 'Tổng Số Người Học',
      dataIndex: 'count',
      key: 'count',
      width: '30%',
      align: 'center',
      render: (value?: number) => (
        <Badge count={value || 0} style={styles.badgeSuccessStyle} />
      ),
    },
  ];
  return (
    <div style={styles.panel}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitle}>Danh sách lớp thực hành</div>
        <div style={styles.sectionSubtitle}>
          Chọn một lớp thực hành để xem người học
        </div>
      </div>
      <Table
        className="lesson-learners-overview__table"
        columns={practiceColumns}
        dataSource={dataSource}
        rowKey="_id"
        loading={loading}
        size="middle"
        pagination={false}
        onRow={record => ({
          onClick: () => onSelectClass(record),
          className: 'lesson-learners-overview__table-row-clickable',
        })}
        locale={{
          emptyText: 'Không có dữ liệu lớp thực hành',
        }}
      />
    </div>
  );
};

export default PracticeClassOverview;
