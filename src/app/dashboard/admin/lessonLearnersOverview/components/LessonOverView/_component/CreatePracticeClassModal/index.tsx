import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Table,
  Checkbox,
  Space,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminQuery } from '~mdAdmin/redux';
import { useAppPagination } from '@hooks';
import {
  CreatePracticeClassResponse,
  LessonLearnerPoolItem,
} from '~mdAdmin/redux/RTKQuery/type';

type Props = {
  open: boolean;
  onClose: () => void;
  lessonId?: string;
  onCreated: () => void;
};

const CreatePracticeClassModal: React.FC<Props> = ({
  open,
  onClose,
  lessonId,
  onCreated,
}) => {
  const [form] = Form.useForm();
  const [selectedUsers, setSelectedUsers] = useState<LessonLearnerPoolItem[]>(
    [],
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [createdPracticeClass, setCreatedPracticeClass] =
    useState<CreatePracticeClassResponse | null>(null);
  const [searchText, setSearchText] = useState('');
  const [createPracticeClass] = adminQuery.useCreatePracticeClassMutation();
  const [sendPracticeClassEmails, { isLoading: isSendingEmails }] =
    adminQuery.useSendPracticeClassEmailsMutation();
  const { listItem, currentData, fetchData, search, refresh } =
    useAppPagination<any>({
      apiUrl: `admin/lessons/${lessonId}/learners/pool`,
      isLazy: true,
      params: {
        isFull: true,
      },
    });

  useEffect(() => {
    if (open) {
      fetchData();
      refresh();
    }
  }, [open, lessonId]);

  const handleSubmit = async () => {
    if (!lessonId) {
      message.warning('Thiếu lessonId');
      return;
    }

    try {
      const response = await createPracticeClass({
        lessonId,
        body: {
          listUser: selectedUsers.map(user => user._id),
          class: form.getFieldValue('class'),
          practiceClassName: form.getFieldValue('practiceClassName'),
        },
      }).unwrap();

      // Không đóng modal ngay — hiện bước xác nhận để admin có thể gửi
      // email báo cho học viên trong lớp vừa tạo, rồi mới đóng.
      setCreatedPracticeClass(response);
      messageApi.success('Tạo lớp thực hành thành công');
      form.resetFields();
      setSelectedUsers([]);
      onCreated();
    } catch (error) {
      console.error(error);
      message.error('Tạo practice class thất bại');
    }
  };

  // Modal.confirm (static call) không render ra DOM node nào trong app này
  // (kiểm chứng thực tế lúc sửa PracticeTaskEditorDrawer — khả năng thiếu
  // context antd <App> cho các static method), nên hộp thoại xác nhận gửi
  // email THẬT SỰ không bao giờ hiện ra — bấm "Gửi email cho học viên"
  // trước đây không có phản ứng gì. Đổi sang <Modal open> có state riêng.
  const [isConfirmSendOpen, setIsConfirmSendOpen] = useState(false);

  const handleSendEmails = () => {
    if (!createdPracticeClass) return;
    setIsConfirmSendOpen(true);
  };

  const confirmSendEmails = async () => {
    if (!createdPracticeClass) return;
    setIsConfirmSendOpen(false);
    try {
      const result = await sendPracticeClassEmails({
        classId: createdPracticeClass._id,
      }).unwrap();
      messageApi.success(
        `Đã gửi ${result.successful}/${result.successful + result.failed} email thành công`,
      );
    } catch (error) {
      console.error(error);
      messageApi.error('Gửi email thất bại');
    }
  };

  const handleCloseAll = () => {
    setCreatedPracticeClass(null);
    onClose();
  };
  const columns: ColumnsType<LessonLearnerPoolItem> = [
    {
      title: (
        <Checkbox
          checked={
            currentData?.totalAvailable > 0 &&
            selectedUsers?.length === currentData?.totalAvailable
          }
          onChange={e => {
            if (e.target.checked) {
              setSelectedUsers(listItem);
            } else {
              setSelectedUsers([]);
            }
          }}
        />
      ),
      key: 'select',
      width: 60,
      render: (_, record) => (
        <Checkbox
          key={record._id}
          checked={selectedUsers.some(item => item._id === record._id)}
          onChange={e => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, record]);
            } else {
              setSelectedUsers(
                selectedUsers.filter(item => item._id !== record._id),
              );
            }
          }}
        />
      ),
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: '_id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
    },
  ];
  return (
    <Modal
      open={open}
      onCancel={handleCloseAll}
      title="Tạo Practice Class"
      width={'80%'}
      footer={null}>
      {contextHolder}
      {createdPracticeClass ? (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>
              Đã tạo lớp &quot;{createdPracticeClass.practiceClassName}&quot;
              thành công
            </Typography.Title>
            <Typography.Text type="secondary">
              {createdPracticeClass.count} học viên trong lớp.
            </Typography.Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleCloseAll}>Đóng</Button>
            <Button
              type="primary"
              loading={isSendingEmails}
              onClick={handleSendEmails}>
              Gửi email cho học viên
            </Button>
          </div>
        </Space>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              label="Tên lớp thực hành"
              name="practiceClassName"
              rules={[{ required: true }]}>
              <Input placeholder="Nhập tên lớp thực thành" />
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              label="Nhập mã lớp thực thành"
              name="class">
              <Input style={{ width: '100%' }} />
            </Form.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
                flexWrap: 'wrap',
              }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  Chọn: {selectedUsers.length} /{' '}
                  {currentData?.totalRecords || 0} học viên
                </div>
                <div style={{ color: '#595959' }}>
                  Chọn tối thiểu 30 học viên để tạo lớp thực hành.
                </div>
              </div>
            </div>
            <Input.Search
              placeholder="Tìm học viên"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={value => {
                setSearchText(value);
                search(value);
              }}
              style={{ marginBottom: 12 }}
            />
            <Table
              columns={columns}
              dataSource={listItem}
              rowKey="_id"
              onChange={res => {
                fetchData({ pageNum: res.current });
              }}
              onRow={record => ({
                onClick: () => {
                  const isSelected = selectedUsers.some(
                    item => item._id === record._id,
                  );
                  if (isSelected) {
                    setSelectedUsers(prev =>
                      prev.filter(item => item._id !== record._id),
                    );
                  } else {
                    setSelectedUsers(prev => [...prev, record]);
                  }
                },
              })}
              pagination={{
                current: currentData?.pageNum,
                total: currentData?.totalRecords,
                pageSize: currentData?.pageSize,
                showSizeChanger: false,
                position: ['bottomCenter'],
              }}
            />
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={handleCloseAll}>Đóng</Button>
              <Button type="primary" htmlType="submit">
                Tạo lớp thực hành
              </Button>
            </div>
          </Space>
        </Form>
      )}

      <Modal
        title="Gửi email cho học viên?"
        open={isConfirmSendOpen}
        onCancel={() => setIsConfirmSendOpen(false)}
        okText="Gửi email"
        cancelText="Huỷ"
        onOk={confirmSendEmails}
        confirmLoading={isSendingEmails}>
        {createdPracticeClass &&
          `Hệ thống sẽ gửi email báo cho ${createdPracticeClass.count} học viên trong lớp "${createdPracticeClass.practiceClassName}" — hành động này gửi email thật, không thể thu hồi.`}
      </Modal>
    </Modal>
  );
};

export default CreatePracticeClassModal;
