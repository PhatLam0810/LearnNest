'use client';
import React, { useState } from 'react';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { QuestionBankItem } from '~mdAdmin/redux/RTKQuery/type';
import {
  ContentToolbar,
  FilteredEmptyState,
  QuizBuilderModal,
  ThemedTable,
} from '~mdAdmin/components';

const QuestionBankTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: items, isFetching } = adminQuery.useGetQuestionBankQuery(
    searchQuery || undefined,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [seedQuestions, setSeedQuestions] = useState<
    ReturnType<typeof toDraft>[]
  >([]);

  const openBulkInsert = () => {
    if (selectedIds.length === 0) {
      messageApi.error('Chọn ít nhất 1 câu hỏi để chèn vào bài tập');
      return;
    }
    const selected = (items || []).filter(i => selectedIds.includes(i._id));
    setSeedQuestions(selected.map(toDraft));
    setIsBuilderOpen(true);
  };

  const columns = [
    { title: 'Câu hỏi', dataIndex: 'questionText', key: 'questionText' },
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
  ];

  return (
    <>
      <ContentToolbar
        searchPlaceholder="Tìm kiếm câu hỏi"
        onSearch={setSearchQuery}
        addLabel="Chèn vào bài tập mới"
        onAdd={openBulkInsert}
      />
      <ThemedTable
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={items || []}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: keys => setSelectedIds(keys as string[]),
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

      <QuizBuilderModal
        isVisible={isBuilderOpen}
        initialQuestions={seedQuestions}
        onClose={() => {
          setIsBuilderOpen(false);
          setSelectedIds([]);
        }}
      />
    </>
  );
};

function toDraft(item: QuestionBankItem) {
  return {
    key: `bank-${item._id}`,
    questionText: item.questionText,
    answers: item.answers,
    explanation: item.explanation || '',
    bankItemId: item._id,
  };
}

export default QuestionBankTab;
