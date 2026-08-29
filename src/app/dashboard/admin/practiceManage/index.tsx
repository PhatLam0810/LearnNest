'use client';
import React, { useState } from 'react';
import { View, Text } from 'react-native-web';
import { Button, Input, Modal, Select, Space, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { PracticeSubject, PracticeTask } from '~mdDashboard/types/practice';
import PracticeTaskEditorDrawer from './_components/PracticeTaskEditorDrawer';
import PracticeSubmissionsModal from './_components/PracticeSubmissionsModal';

const PracticeManage = () => {
  const [subjectFilter, setSubjectFilter] = useState<
    PracticeSubject | undefined
  >();
  const [search, setSearch] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<PracticeTask | null>(null);
  const [submissionsTaskId, setSubmissionsTaskId] = useState<
    string | undefined
  >();

  const { data, isFetching, refetch } =
    adminQuery.useGetPracticeTasksAdminQuery(
      subjectFilter ? { subject: subjectFilter } : undefined,
    );
  const [deleteTask, { isLoading: isDeleting }] =
    adminQuery.useDeletePracticeTaskMutation();

  const filteredData = (data || []).filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditingTaskId(undefined);
    setIsDrawerOpen(true);
  };

  const openEdit = (task: PracticeTask) => {
    setEditingTaskId(task._id);
    setIsDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask._id).unwrap();
      messageApi.success('Đã xoá đề thực hành');
      setDeletingTask(null);
      refetch();
    } catch {
      messageApi.error('Xoá đề thực hành thất bại');
    }
  };

  const columns = [
    {
      title: 'Môn',
      dataIndex: 'subject',
      key: 'subject',
      render: (v: PracticeSubject) => (
        <Tag color={v === 'Excel' ? 'green' : 'blue'}>{v}</Tag>
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
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
      render: (_: any, record: PracticeTask) => (
        <Space onClick={e => e.stopPropagation()}>
          <a onClick={() => openEdit(record)}>Sửa</a>
          <a onClick={() => setSubmissionsTaskId(record._id)}>Bài nộp</a>
          <a onClick={() => setDeletingTask(record)} style={{ color: 'red' }}>
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
          gap: 8,
        }}>
        <Space>
          <Input.Search
            placeholder="Tìm theo tiêu đề"
            allowClear
            onSearch={setSearch}
            onChange={e => !e.target.value && setSearch('')}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="Tất cả môn"
            style={{ width: 140 }}
            value={subjectFilter}
            onChange={setSubjectFilter}
            options={[
              { value: 'Excel', label: 'Excel' },
              { value: 'Word', label: 'Word' },
            ]}
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          <Text style={{ color: '#FFF' }}>Thêm đề thực hành</Text>
        </Button>
      </View>

      <Table
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
      />

      <PracticeTaskEditorDrawer
        open={isDrawerOpen}
        taskId={editingTaskId}
        onClose={() => setIsDrawerOpen(false)}
        onSaved={refetch}
      />

      <PracticeSubmissionsModal
        taskId={submissionsTaskId}
        onClose={() => setSubmissionsTaskId(undefined)}
      />

      <Modal
        title="Xoá đề thực hành"
        open={!!deletingTask}
        onCancel={() => setDeletingTask(null)}
        onOk={handleDelete}
        confirmLoading={isDeleting}>
        <Text>{`Xoá đề: ${deletingTask?.title}? Toàn bộ tiêu chí và bài nộp liên quan sẽ không còn hiển thị.`}</Text>
      </Modal>
    </View>
  );
};

export default PracticeManage;
