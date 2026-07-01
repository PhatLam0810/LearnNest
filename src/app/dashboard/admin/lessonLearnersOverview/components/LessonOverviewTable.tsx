import React from 'react';
import { Badge, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LessonLearnersSummary } from '~mdAdmin/redux/RTKQuery/type';
import styles from '../styles';

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

// Learner Columns
const learnerColumns: ColumnsType<LessonLearnersSummary> = [
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

const LessonOverviewTable: React.FC<Props> = ({
  dataSource,
  loading,
  onSelectLesson,
}) => {
  return (
    <div style={styles.panel}>
      <div style={styles.sectionHeader}>
        <div>
          <div style={styles.sectionTitle}>Danh sách khóa học</div>
          <div style={styles.sectionSubtitle}>
            Chọn một khóa học để xem người học và lớp thực hành
          </div>
        </div>
        <div style={styles.sectionBadge}>Live</div>
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
