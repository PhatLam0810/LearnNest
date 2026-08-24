import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LessonLearnersSummary } from '~mdAdmin/redux/RTKQuery/type';
import styles from './styles';

type Props = {
  dataSource: LessonLearnersSummary[];
  loading: boolean;
  onSelectLesson: (record: LessonLearnersSummary) => void;
};

const completionStatus = (rate: number) => {
  if (rate >= 80) return { color: 'success', text: 'Hoàn thành tốt' };
  if (rate >= 40) return { color: 'processing', text: 'Đang triển khai' };
  return { color: 'warning', text: 'Cần theo dõi' };
};

const lessonColumns: ColumnsType<LessonLearnersSummary> = [
  {
    title: 'Tên Khóa Học',
    dataIndex: 'title',
    key: 'title',
    width: '40%',
    render: (value: string) => (
      <span style={styles.courseTitleCell}>{value}</span>
    ),
  },
  {
    title: 'Tổng Số Người Học',
    dataIndex: 'totalLearners',
    key: 'totalLearners',
    width: '25%',
    align: 'center',
    render: (value: number) => (
      <span style={styles.learnerCountCell}>{value || 0} học viên</span>
    ),
  },
  {
    title: 'Tỉ Lệ Hoàn Thành',
    dataIndex: 'completionRate',
    key: 'completionRate',
    width: '15%',
    align: 'center',
    render: (value: number) => `${value.toFixed(1)}%`,
  },
  {
    title: 'Trạng Thái',
    dataIndex: 'completionRate',
    key: 'status',
    width: '20%',
    align: 'center',
    render: (value: number) => {
      const status = completionStatus(value || 0);
      return <Tag color={status.color}>{status.text}</Tag>;
    },
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
        className="course-overview__table"
        columns={lessonColumns}
        dataSource={dataSource}
        rowKey="_id"
        loading={loading}
        size="middle"
        pagination={false}
        onRow={record => ({
          onClick: () => onSelectLesson(record),
          className: 'course-overview__table-row-clickable',
        })}
        locale={{
          emptyText: 'Không có dữ liệu khóa học',
        }}
      />
    </div>
  );
};

export default LessonOverviewTable;
