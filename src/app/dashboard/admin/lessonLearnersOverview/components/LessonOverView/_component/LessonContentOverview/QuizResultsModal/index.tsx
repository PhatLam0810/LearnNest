import React from 'react';
import { Button, Modal, Popconfirm, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { ReminderHistory } from '~mdAdmin/components';
import { dashboardQuery } from '~mdDashboard/redux';
import { QuizResultAdminItem } from '~mdDashboard/redux/RTKQuery/types';

type Props = {
  lessonId: string;
  libraryId?: string;
  onClose: () => void;
};

// Đối xứng hoàn toàn PracticeSubmissionsModal (thư mục practiceManage)
// nhưng cho bài trắc nghiệm - lessonId nhận thẳng từ component cha
// (LessonContentOverview) thay vì phải gọi riêng 1 API lấy lessonId như bên
// thực hành, vì modal này chỉ mở từ đúng 1 chỗ đã có sẵn lessonId.
const QuizResultsModal: React.FC<Props> = ({
  lessonId,
  libraryId,
  onClose,
}) => {
  const { data, isFetching } = dashboardQuery.useGetResultsForLibraryQuery(
    libraryId || '',
    { skip: !libraryId },
  );
  const [remindNotPassed, { isLoading: isReminding }] =
    adminQuery.useRemindNotPassedQuizMutation();

  const handleRemindNotPassed = async () => {
    if (!libraryId) return;
    try {
      const res = await remindNotPassed({ lessonId, libraryId }).unwrap();
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
      render: (_: any, record: QuizResultAdminItem) =>
        record.user ? (
          <div>
            <div>{record.user.fullName || '—'}</div>
            <div style={{ color: '#888', fontSize: 12 }}>
              {record.user.email}
              {record.user.class ? ` · Lớp ${record.user.class}` : ''}
            </div>
          </div>
        ) : (
          record.userName || '—'
        ),
    },
    {
      title: 'Điểm',
      key: 'score',
      render: (_: any, record: QuizResultAdminItem) => (
        <Tag color={record.isPass ? 'green' : 'red'}>
          {record.correctCount}/{record.totalQuestions} câu
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isPass',
      render: (_: any, record: QuizResultAdminItem) => (
        <Tag color={record.isPass ? 'success' : 'error'}>
          {record.isPass ? 'Đạt' : 'Chưa đạt'}
        </Tag>
      ),
    },
    {
      title: 'Thời gian làm',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => dayjs(v).format('HH:mm DD/MM/YYYY'),
    },
  ];

  return (
    <Modal
      title="Kết quả trắc nghiệm"
      open={!!libraryId}
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
        {libraryId ? (
          <ReminderHistory
            lessonId={lessonId}
            type="quiz"
            targetId={libraryId}
          />
        ) : (
          <span />
        )}
        <Popconfirm
          title="Gửi email nhắc nhở?"
          description="Sẽ gửi email THẬT tới toàn bộ học viên chưa đạt bài trắc nghiệm này. Không thể thu hồi sau khi gửi."
          okText="Gửi"
          cancelText="Huỷ"
          onConfirm={handleRemindNotPassed}>
          <Button loading={isReminding}>Nhắc người chưa đạt</Button>
        </Popconfirm>
      </div>
      <Table
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={data || []}
        locale={{ emptyText: 'Chưa có ai làm bài này' }}
        pagination={false}
      />
    </Modal>
  );
};

export default QuizResultsModal;
