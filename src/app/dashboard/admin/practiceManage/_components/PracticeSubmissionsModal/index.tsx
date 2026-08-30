import React from 'react';
import { Button, Modal, Popconfirm, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { ReminderHistory } from '~mdAdmin/components';
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
  // Cần lessonId để gọi API nhắc — task tự mang theo lessonId của chính nó
  // (gắn lúc soạn đề), không cần caller của modal này biết trước.
  const { data: taskDetail } = adminQuery.useGetPracticeTaskDetailAdminQuery(
    taskId,
    { skip: !taskId },
  );
  const [remindNotPassed, { isLoading: isReminding }] =
    adminQuery.useRemindNotPassedTaskMutation();

  const handleRemindNotPassed = async () => {
    const lessonId = taskDetail?.task?.lessonId;
    if (!taskId || !lessonId) {
      messageApi.warning(
        'Bài này chưa gắn vào khóa thực hành nào nên không xác định được ai cần nhắc',
      );
      return;
    }
    try {
      const res = await remindNotPassed({ lessonId, taskId }).unwrap();
      if (res.totalEligible === 0) {
        messageApi.info(
          'Hiện không có ai cần nhắc (đã đạt hết hoặc mới nhắc gần đây)',
        );
        return;
      }
      messageApi.success(
        `Đã nhắc ${res.sent}/${res.totalEligible} học viên chưa đạt${
          res.failed ? ` (${res.failed} gửi thất bại)` : ''
        }`,
      );
    } catch (error: any) {
      messageApi.error(
        error?.data?.message || 'Gửi nhắc nhở thất bại, thử lại sau',
      );
    }
  };

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
        {taskId && taskDetail?.task?.lessonId ? (
          <ReminderHistory
            lessonId={taskDetail.task.lessonId}
            type="task"
            targetId={taskId}
          />
        ) : (
          <span />
        )}
        <Popconfirm
          title="Gửi email nhắc nhở?"
          description="Sẽ gửi email THẬT tới toàn bộ học viên chưa đạt bài thực hành này. Không thể thu hồi sau khi gửi."
          okText="Gửi"
          cancelText="Huỷ"
          onConfirm={handleRemindNotPassed}>
          <Button loading={isReminding}>Nhắc người chưa làm</Button>
        </Popconfirm>
      </div>
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
        locale={{ emptyText: 'Chưa có ai nộp bài' }}
        pagination={false}
      />
    </Modal>
  );
};

export default PracticeSubmissionsModal;
