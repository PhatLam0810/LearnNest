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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminQuery } from '~mdAdmin/redux';
import { messageApi, useAppPagination } from '@hooks';
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
  const [createdPracticeClass, setCreatedPracticeClass] =
    useState<CreatePracticeClassResponse | null>(null);
  const [searchText, setSearchText] = useState('');
  const [createPracticeClass] = adminQuery.useCreatePracticeClassMutation();
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

      setCreatedPracticeClass(response);
      message.success('Tạo practice class thành công');
      form.resetFields();
      onCreated();
    } catch (error) {
      console.error(error);
      message.error('Tạo practice class thất bại');
    }
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
      onCancel={onClose}
      title="Tạo Practice Class"
      width={'80%'}
      footer={null}>
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
                Chọn: {selectedUsers.length} / {currentData?.totalRecords || 0}{' '}
                học viên
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onClose}>Đóng</Button>
            <Button type="primary" htmlType="submit">
              Tạo lớp thực hành
            </Button>
          </div>
        </Space>
      </Form>
    </Modal>
  );
};

export default CreatePracticeClassModal;
