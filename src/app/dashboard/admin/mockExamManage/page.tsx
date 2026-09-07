'use client';
import React, { useState } from 'react';
import { View, Text } from 'react-native-web';
import { Button, Modal, Space, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { MockExam } from '~mdDashboard/types/practice';
import MockExamEditorModal from '../practiceManage/_components/MockExamEditorModal';

const MockExamManage = () => {
  const [editingExam, setEditingExam] = useState<MockExam | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingExam, setDeletingExam] = useState<MockExam | null>(null);

  const { data, isFetching } = adminQuery.useGetMockExamsAdminQuery();
  const [deleteExam, { isLoading: isDeleting }] =
    adminQuery.useDeleteMockExamMutation();

  const openCreate = () => {
    setEditingExam(undefined);
    setIsModalOpen(true);
  };
  const openEdit = (exam: MockExam) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingExam) return;
    try {
      await deleteExam(deletingExam._id).unwrap();
      messageApi.success('Đã xoá đề thi thử');
      setDeletingExam(null);
    } catch {
      messageApi.error('Xoá đề thi thử thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Môn',
      dataIndex: 'subject',
      key: 'subject',
      render: (v: string) => (
        <Tag color={v === 'Excel' ? 'green' : v === 'Word' ? 'blue' : 'purple'}>
          {v === 'Mixed' ? 'Word + Excel' : v}
        </Tag>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'durationMinutes',
      key: 'durationMinutes',
      render: (v: number) => `${v} phút`,
    },
    {
      title: 'Số bài',
      key: 'taskCount',
      render: (_: any, r: MockExam) => r.taskIds.length,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'default'}>
          {v ? 'Đã xuất bản' : 'Bản nháp'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: MockExam) => (
        <Space>
          <a onClick={() => openEdit(record)}>Sửa</a>
          <a onClick={() => setDeletingExam(record)} style={{ color: 'red' }}>
            Xoá
          </a>
        </Space>
      ),
    },
  ];

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
        <Text style={{ color: '#8D8D8D' }}>
          Đề thi thử gộp nhiều bài thực hành đã có sẵn vào 1 phiên thi tính giờ,
          mô phỏng áp lực thời gian đề MOS thật.
        </Text>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          <Text style={{ color: '#FFF' }}>Tạo đề thi thử</Text>
        </Button>
      </View>

      <Table
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />

      <MockExamEditorModal
        open={isModalOpen}
        exam={editingExam}
        onClose={() => setIsModalOpen(false)}
      />

      <Modal
        title="Xoá đề thi thử"
        open={!!deletingExam}
        onCancel={() => setDeletingExam(null)}
        onOk={handleDelete}
        confirmLoading={isDeleting}>
        <Text>{`Xoá đề: ${deletingExam?.title}? Các phiên thi đã làm trước đó vẫn giữ nguyên kết quả, chỉ không tạo phiên mới được nữa.`}</Text>
      </Modal>
    </View>
  );
};

export default MockExamManage;
