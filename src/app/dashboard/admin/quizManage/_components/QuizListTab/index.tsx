'use client';
import React, { useState } from 'react';
import { Text } from 'react-native-web';
import { Modal, Space } from 'antd';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { Quiz } from '~mdAdmin/redux/RTKQuery/type';
import {
  ContentToolbar,
  FilteredEmptyState,
  QuizBuilderModal,
  ThemedTable,
} from '~mdAdmin/components';
import styles from './styles';

const QuizListTab: React.FC = () => {
  const { data: quizzes, isFetching } = adminQuery.useGetQuizzesQuery();
  const [deleteQuiz] = adminQuery.useDeleteQuizMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<Quiz | undefined>();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [deleting, setDeleting] = useState<Quiz | null>(null);

  const filtered = (quizzes || []).filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(undefined);
    setIsBuilderOpen(true);
  };
  const openEdit = (quiz: Quiz) => {
    setEditing(quiz);
    setIsBuilderOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteQuiz(deleting._id).unwrap();
      messageApi.success('Đã xoá bài tập');
      setDeleting(null);
    } catch (e: any) {
      messageApi.error(e?.data?.message || 'Xoá bài tập thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên bài tập',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Bài học',
      key: 'libraryTitle',
      render: (_: unknown, r: Quiz) =>
        typeof r.libraryId === 'object' ? r.libraryId.title : '—',
    },
    {
      title: 'Số câu',
      key: 'questionCount',
      render: (_: unknown, r: Quiz) => r.questions.length,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 260,
      render: (_: unknown, record: Quiz) => (
        <Space size={10}>
          <button
            style={styles.actionButton}
            onClick={() => setDeleting(record)}>
            <Text style={styles.actionButtonText}>Xóa</Text>
          </button>
          <button style={styles.actionButton} onClick={() => openEdit(record)}>
            <Text style={styles.actionButtonText}>Cập nhật</Text>
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ContentToolbar
        searchPlaceholder="Tìm kiếm bài tập"
        onSearch={setSearchQuery}
        addLabel="Tạo bài tập"
        onAdd={openCreate}
      />
      <ThemedTable
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: searchQuery ? (
            <FilteredEmptyState
              query={searchQuery}
              onClear={() => setSearchQuery('')}
            />
          ) : undefined,
        }}
      />

      <QuizBuilderModal
        isVisible={isBuilderOpen}
        editing={editing}
        onClose={() => setIsBuilderOpen(false)}
      />

      <Modal
        title="Xóa bài tập"
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onOk={handleDelete}>
        <Text>{`Xóa bài tập: ${deleting?.title}? Không thể hoàn tác.`}</Text>
      </Modal>
    </>
  );
};

export default QuizListTab;
