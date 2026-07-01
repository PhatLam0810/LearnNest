import React from 'react';
import { Badge, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../styles';

type PracticeClassRecord = {
  _id: string;
  className: string;
  createdAt: string;
  userCount: number;
};

type Props = {
  dataSource: PracticeClassRecord[];
  loading: boolean;
  onSelectClass: (record: PracticeClassRecord) => void;
};

const practiceColumns: ColumnsType<PracticeClassRecord> = [
  {
    title: 'Tên Lớp Thực Hành',
    dataIndex: 'className',
    key: 'className',
    width: '45%',
  },
  {
    title: 'Ngày Tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '25%',
    render: (value: string) => value || '—',
  },
  {
    title: 'Số Người Dùng',
    dataIndex: 'userCount',
    key: 'userCount',
    width: '30%',
    align: 'center',
    render: (value: number) => (
      <Badge count={value} style={styles.badgeSuccessStyle} />
    ),
  },
];

const PracticeClassOverview: React.FC<Props> = ({
  dataSource,
  loading,
  onSelectClass,
}) => {
  return (
    <div style={styles.practiceSectionWrap}>
      <div style={styles.practiceHeader}>
        <div>
          <div style={styles.practiceHeaderTitle}>Danh sách lớp thực hành</div>
          <div style={styles.practiceHeaderSubtitle}>
            Chỉ hiển thị các lớp đã được tạo cho khóa học này
          </div>
        </div>
        <div style={styles.sectionBadge}>Practice</div>
      </div>
      <div style={styles.tableCard}>
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
          locale={{ emptyText: 'Không có lớp thực hành' }}
        />
      </div>
    </div>
  );
};

export default PracticeClassOverview;
