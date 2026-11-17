'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal } from 'antd';
import AppButton from '@components/AppButton';
import { adminQuery } from '~mdAdmin/redux';
import { QuestionBankItem } from '~mdAdmin/redux/RTKQuery/type';
import { messageApi } from '@hooks';
import {
  BankQuestionModal,
  AdminGuide,
  ContentToolbar,
  FilteredEmptyState,
  QuizBuilderModal,
  ThemedTable,
} from '~mdAdmin/components';
import { QUESTION_TYPE_LABEL } from '~mdAdmin/utils/questionTypes';
import pageStyles from '../../styles';

const buttonStyle = { width: 'auto', height: 40 } as const;
const smallButtonStyle = { width: 'auto', height: 32 } as const;

const QuestionBankTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: items,
    isFetching,
    isError,
    refetch,
  } = adminQuery.useGetQuestionBankQuery(searchQuery || undefined);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  // Thêm mới (editingItem undefined) hoặc sửa 1 câu trong ngân hàng.
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<
    QuestionBankItem | undefined
  >();
  const [deleteQuestion, { isLoading: isDeleting }] =
    adminQuery.useDeleteBankQuestionMutation();
  // Hộp xác nhận dạng khai báo: Modal.confirm() không hiện ở trang admin này.
  const [deletingItem, setDeletingItem] = useState<QuestionBankItem | null>(
    null,
  );
  const [seedQuestions, setSeedQuestions] = useState<
    ReturnType<typeof toDraft>[]
  >([]);

  const openBulkInsert = () => {
    const selected = (items || []).filter(i => selectedIds.includes(i._id));
    setSeedQuestions(selected.map(toDraft));
    setIsBuilderOpen(true);
  };

  const columns = [
    { title: 'Câu hỏi', dataIndex: 'questionText', key: 'questionText' },
    {
      title: 'Dạng',
      key: 'type',
      render: (_: unknown, r: QuestionBankItem) =>
        QUESTION_TYPE_LABEL[
          r.type ??
            (r.answers.filter(a => a.isCorrect).length > 1
              ? 'multiple'
              : 'single')
        ],
    },
    {
      title: 'Số đáp án đúng',
      key: 'correctCount',
      render: (_: unknown, r: QuestionBankItem) =>
        r.answers.filter(a => a.isCorrect).length,
    },
    {
      title: 'Bài học',
      key: 'libraryTitle',
      render: (_: unknown, r: QuestionBankItem) =>
        typeof r.libraryId === 'object' ? r.libraryId?.title : '—',
    },
    {
      title: 'Lần dùng',
      dataIndex: 'usageCount',
      key: 'usageCount',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: unknown, r: QuestionBankItem) => (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <AppButton
            style={smallButtonStyle}
            onClick={() => openEditQuestion(r)}>
            Sửa
          </AppButton>
          <AppButton
            danger
            style={smallButtonStyle}
            onClick={() => confirmDelete(r)}>
            Xóa
          </AppButton>
        </View>
      ),
    },
  ];

  const openAddQuestion = () => {
    setEditingItem(undefined);
    setIsBankModalOpen(true);
  };
  const openEditQuestion = (item: QuestionBankItem) => {
    setEditingItem(item);
    setIsBankModalOpen(true);
  };
  const confirmDelete = (item: QuestionBankItem) => setDeletingItem(item);

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteQuestion(deletingItem._id).unwrap();
      setSelectedIds(prev => prev.filter(id => id !== deletingItem._id));
      messageApi.success('Đã xóa câu hỏi');
      setDeletingItem(null);
    } catch {
      messageApi.error('Xóa câu hỏi thất bại');
    }
  };

  const renderContent = () => {
    if (isError) {
      return (
        <View style={{ ...pageStyles.stateWrap, ...pageStyles.errorWrap }}>
          <Text style={pageStyles.errorText}>
            Không tải được ngân hàng câu hỏi.
          </Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!isFetching && !items?.length && !searchQuery) {
      return (
        <View style={pageStyles.stateWrap}>
          <Text style={pageStyles.emptyText}>
            Ngân hàng chưa có câu hỏi nào. Bấm &quot;Thêm câu hỏi&quot; để soạn
            câu hỏi hoặc tạo từ ảnh/PDF/zip bằng AI.
          </Text>
          <AppButton
            type="primary"
            style={buttonStyle}
            onClick={openAddQuestion}>
            Thêm câu hỏi
          </AppButton>
        </View>
      );
    }
    return (
      <ThemedTable
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={items || []}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: keys => setSelectedIds(keys as string[]),
          getCheckboxProps: () => ({ 'aria-label': 'Chọn câu hỏi' }) as never,
        }}
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
        title="ngân hàng câu hỏi"
        steps={[
          'Bấm "Thêm câu hỏi", chọn dạng (chọn 1 / chọn nhiều / kéo thả), nhập đề và đáp án, tích đáp án đúng. Có thể thêm nhiều câu một lần hoặc tạo bằng AI từ ảnh/PDF.',
          'Dùng Sửa / Xóa ở mỗi dòng để chỉnh câu hỏi. Xóa câu trong ngân hàng không ảnh hưởng bài tập đã dùng câu đó.',
          'Tích chọn các câu cần dùng rồi bấm "Chèn vào bài tập mới" để tạo bài tập từ các câu đã chọn.',
        ]}
      />
      <ContentToolbar
        searchPlaceholder="Tìm kiếm câu hỏi"
        onSearch={setSearchQuery}
        addLabel="Thêm câu hỏi"
        onAdd={openAddQuestion}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <AppButton
          style={buttonStyle}
          disabled={selectedIds.length === 0}
          onClick={openBulkInsert}>
          {selectedIds.length
            ? `Chèn ${selectedIds.length} câu vào bài tập mới`
            : 'Chèn vào bài tập mới (chọn câu hỏi trước)'}
        </AppButton>
      </View>
      {renderContent()}

      <Modal
        title="Xóa câu hỏi khỏi ngân hàng?"
        open={!!deletingItem}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isDeleting }}
        onCancel={() => setDeletingItem(null)}
        onOk={handleDelete}>
        <Text>
          Bài tập đã chèn câu này vẫn giữ bản sao riêng, chỉ ngân hàng bị xóa.
        </Text>
      </Modal>
      <BankQuestionModal
        isVisible={isBankModalOpen}
        editing={editingItem}
        onClose={() => setIsBankModalOpen(false)}
      />
      <QuizBuilderModal
        isVisible={isBuilderOpen}
        initialQuestions={seedQuestions}
        onClose={() => {
          setIsBuilderOpen(false);
          setSelectedIds([]);
        }}
      />
    </View>
  );
};

function toDraft(item: QuestionBankItem) {
  return {
    key: `bank-${item._id}`,
    type: item.type,
    questionText: item.questionText,
    answers: item.answers,
    explanation: item.explanation || '',
    bankItemId: item._id,
  };
}

export default QuestionBankTab;
