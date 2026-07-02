import React from 'react';
import { Badge, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LessonLearnersSummary } from '~mdAdmin/redux/RTKQuery/type';
import styles from './styles';

type Props = {
  dataSource: LessonLearnersSummary[];
  loading: boolean;
  onSelectLesson: (record: LessonLearnersSummary) => void;
};

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

const LessonOverviewTable: React.FC<Props> = ({
  dataSource,
  loading,
  onSelectLesson,
}) => {
  return (
    <div style={styles.panel}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitle}>Danh sách khóa học</div>
        <div style={styles.sectionSubtitle}>
          Chọn một khóa học để xem người học và lớp thực hành
        </div>
      </div>
      <Table
        className="lesson-learners-overview__table"
        columns={lessonColumns}
        dataSource={dataSource}
        rowKey="_id"
        loading={loading}
        size="middle"
        pagination={false}
        onRow={record => ({
          onClick: () => onSelectLesson(record),
          className: 'lesson-learners-overview__table-row-clickable',
        })}
        locale={{
          emptyText: 'Không có dữ liệu khóa học',
        }}
      />
    </div>
  );
};

export default LessonOverviewTable;
