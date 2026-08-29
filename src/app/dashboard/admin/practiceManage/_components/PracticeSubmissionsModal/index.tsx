import React from 'react';
import { Modal, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { adminQuery } from '~mdAdmin/redux';
import {
  PracticeSubmission,
  PracticeSubmissionUser,
} from '~mdDashboard/types/practice';

type Props = {
  taskId?: string;
  onClose: () => void;
};

const PracticeSubmissionsModal: React.FC<Props> = ({ taskId, onClose }) => {
  const { data, isFetching } = adminQuery.useGetPracticeSubmissionsForTaskQuery(
    taskId,
    { skip: !taskId },
  );

  const columns = [
    {
      title: 'Học viên',
      key: 'user',
      render: (_: any, record: PracticeSubmission) => {
        const user = record.userId as PracticeSubmissionUser;
        if (!user || typeof user === 'string') return '—';
        return (
          <div>
            <div>{user.fullName || '—'}</div>
            <div style={{ color: '#888', fontSize: 12 }}>
              {user.email} {user.class ? `· Lớp ${user.class}` : ''}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Điểm',
      key: 'score',
      render: (_: any, record: PracticeSubmission) => (
        <Tag color={record.totalScore === record.maxScore ? 'green' : 'blue'}>
          {record.totalScore}/{record.maxScore}
        </Tag>
      ),
    },
    {
      title: 'Thời gian nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (v: string) => dayjs(v).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'File bài nộp',
      key: 'fileUrl',
      render: (_: any, record: PracticeSubmission) => (
        <a href={record.fileUrl} target="_blank" rel="noreferrer">
          Tải xuống
        </a>
      ),
    },
  ];

  return (
    <Modal
      title="Danh sách bài nộp"
      open={!!taskId}
      onCancel={onClose}
      footer={null}
      width={800}>
      <Table
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={data || []}
        expandable={{
          expandedRowRender: (record: PracticeSubmission) => (
            <div>
              {record.results.map((r, idx) => (
                <div key={r.criteriaId} style={{ marginBottom: 4 }}>
                  <Tag color={r.passed ? 'green' : 'red'}>
                    {r.passed ? 'Đạt' : 'Chưa đạt'}
                  </Tag>
                  Tiêu chí {idx + 1}: {r.detail}
                </div>
              ))}
            </div>
          ),
        }}
        pagination={false}
      />
    </Modal>
  );
};

export default PracticeSubmissionsModal;
