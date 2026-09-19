'use client';
import React, { useState } from 'react';
import { View, Text } from 'react-native-web';
import { Modal, Select, Space, Tag } from 'antd';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import {
  PracticeDifficulty,
  PracticeSubject,
  PracticeTask,
} from '~mdDashboard/types/practice';
import {
  ContentToolbar,
  FilteredEmptyState,
  ThemedTable,
} from '~mdAdmin/components';
import PracticeTaskEditorDrawer from './_components/PracticeTaskEditorDrawer';
import PracticeSubmissionsModal from './_components/PracticeSubmissionsModal';
import styles from './styles';

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

  // Không cần refetch() thủ công nữa — getPracticeTasksAdmin đã providesTags
  // 'PracticeTask', các mutation bên dưới (xoá/tạo/sửa/đổi module) đều
  // invalidatesTags cùng loại nên list tự cập nhật.
  const { data, isFetching } = adminQuery.useGetPracticeTasksAdminQuery(
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
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (v?: PracticeDifficulty) =>
        v ? (
          <Tag
            color={
              v === 'Dễ' ? 'success' : v === 'Trung bình' ? 'warning' : 'error'
            }>
            {v}
          </Tag>
        ) : (
          '—'
        ),
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
      width: 260,
      render: (_: any, record: PracticeTask) => (
        <Space size={10} onClick={e => e.stopPropagation()}>
          <button style={styles.actionButton} onClick={() => openEdit(record)}>
            <Text style={styles.actionButtonText}>Sửa</Text>
          </button>
          <button
            style={styles.actionButton}
            onClick={() => setSubmissionsTaskId(record._id)}>
            <Text style={styles.actionButtonText}>Bài nộp</Text>
          </button>
          <button
            style={styles.actionButton}
            onClick={() => setDeletingTask(record)}>
            <Text style={styles.actionButtonText}>Xoá</Text>
          </button>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
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
      </View>
      <ContentToolbar
        searchPlaceholder="Tìm theo tiêu đề"
        onSearch={handleSearch}
        addLabel="Thêm đề thực hành"
        onAdd={openCreate}
      />

      <ThemedTable
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: search ? (
            <FilteredEmptyState
              query={search}
              onClear={() => handleSearch('')}
            />
          ) : undefined,
        }}
      />

      <PracticeTaskEditorDrawer
        open={isDrawerOpen}
        taskId={editingTaskId}
        onClose={() => setIsDrawerOpen(false)}
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
