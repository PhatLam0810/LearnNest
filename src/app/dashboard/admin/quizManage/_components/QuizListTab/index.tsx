'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Space } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { Quiz } from '~mdAdmin/redux/RTKQuery/type';
import {
  ContentToolbar,
  AdminGuide,
  FilteredEmptyState,
  PracticeSubjectsModal,
  QuizBuilderModal,
  ThemedTable,
} from '~mdAdmin/components';
import { usePracticeSubjects } from '~mdAdmin/utils/practiceSubjects';
import pageStyles from '../../styles';
import styles from './styles';

const buttonStyle = { width: 'auto', height: 40 } as const;

const QuizListTab: React.FC<{ subject?: string }> = ({ subject }) => {
  const { labelOf: subjectLabel } = usePracticeSubjects();
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const {
    data: quizzes,
    isFetching,
    isError,
    refetch,
  } = adminQuery.useGetQuizzesQuery();
  const [deleteQuiz, { isLoading: isDeleting }] =
    adminQuery.useDeleteQuizMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<Quiz | undefined>();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [deleting, setDeleting] = useState<Quiz | null>(null);

  const filtered = (quizzes || []).filter(
    q =>
      (!subject || q.subject === subject) &&
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
    } catch (e: unknown) {
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Xoá bài tập thất bại',
      );
    }
  };

  const columns = [
    {
      title: 'Tên bài tập',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mục luyện tập',
      key: 'subject',
      render: (_: unknown, r: Quiz) => subjectLabel(r.subject) || '—',
    },
    {
      title: 'Bài học',
      key: 'libraryTitle',
      render: (_: unknown, r: Quiz) =>
        r.libraryId && typeof r.libraryId === 'object'
          ? r.libraryId.title
          : '—',
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

  const renderContent = () => {
    if (isError) {
      return (
        <View style={{ ...pageStyles.stateWrap, ...pageStyles.errorWrap }}>
          <Text style={pageStyles.errorText}>
            Không tải được danh sách bài tập.
          </Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!isFetching && !filtered.length && !searchQuery) {
      return (
        <View style={pageStyles.stateWrap}>
          <Text style={pageStyles.emptyText}>Chưa có bài tập nào.</Text>
          <AppButton type="primary" style={buttonStyle} onClick={openCreate}>
            Tạo bài tập
          </AppButton>
        </View>
      );
    }
    return (
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
    );
  };

  return (
    <View style={pageStyles.tabContent}>
      <AdminGuide
        title="tạo bài tập trắc nghiệm"
        steps={[
          'Bấm "Tạo bài tập" và nhập tên bài tập.',
          'Chọn "Mục luyện tập" (AI, Tiếng Anh...) để bài hiện ở trang Luyện tập của học viên, hoặc gắn vào một bài học. Cần chọn ít nhất một trong hai.',
          'Thêm câu hỏi: chọn dạng (chọn 1 / chọn nhiều / kéo thả), nhập đáp án và tích đáp án đúng. Hoặc bấm tạo bằng AI từ ảnh/PDF/zip rồi xem lại bản nháp.',
          'Đặt Thời gian làm bài (phút), Điểm đạt (%), số lượt làm tối đa, có trộn câu hay không. Để trống thời gian = không giới hạn.',
          'Bấm Lưu. Dùng Cập nhật / Xóa ở mỗi dòng để sửa hoặc xóa.',
          'Muốn thêm mục mới (vd Tiếng Anh): bấm "Quản lý mục luyện tập".',
        ]}
      />
      <ContentToolbar
        searchPlaceholder="Tìm kiếm bài tập"
        onSearch={setSearchQuery}
        addLabel="Tạo bài tập"
        onAdd={openCreate}
      />
      <AppButton style={buttonStyle} onClick={() => setIsSubjectsOpen(true)}>
        Quản lý mục luyện tập
      </AppButton>
      {renderContent()}
      <PracticeSubjectsModal
        open={isSubjectsOpen}
        onClose={() => setIsSubjectsOpen(false)}
      />

      <QuizBuilderModal
        isVisible={isBuilderOpen}
        editing={editing}
        presetSubject={subject}
        onClose={() => setIsBuilderOpen(false)}
      />

      <Modal
        title="Xóa bài tập?"
        open={!!deleting}
        okText="Xóa bài tập"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        confirmLoading={isDeleting}
        onCancel={() => setDeleting(null)}
        onOk={handleDelete}>
        <Text>{`Xóa bài tập: ${deleting?.title}? Không thể hoàn tác.`}</Text>
      </Modal>
    </View>
  );
};

export default QuizListTab;
