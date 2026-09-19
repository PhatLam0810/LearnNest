'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import AppButton from '@components/AppButton';
import { adminQuery } from '~mdAdmin/redux';
import { QuestionBankItem } from '~mdAdmin/redux/RTKQuery/type';
import {
  ContentToolbar,
  FilteredEmptyState,
  QuizBuilderModal,
  ThemedTable,
} from '~mdAdmin/components';
import pageStyles from '../../styles';

const buttonStyle = { width: 'auto', height: 40 } as const;

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

  // Ngân hàng trống thì chưa có gì để chọn -> mở builder không câu hỏi mồi.
  const openEmptyBuilder = () => {
    setSeedQuestions([]);
    setIsBuilderOpen(true);
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
            Ngân hàng chưa có câu hỏi nào. Câu hỏi được thêm khi bạn tạo bài
            tập.
          </Text>
          <AppButton
            type="primary"
            style={buttonStyle}
            onClick={openEmptyBuilder}>
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
    );
  };

  return (
    <View style={pageStyles.tabContent}>
      <ContentToolbar
        searchPlaceholder="Tìm kiếm câu hỏi"
        onSearch={setSearchQuery}
        addLabel="Chèn vào bài tập mới"
        addDisabled={selectedIds.length === 0}
        addDisabledReason="Chọn ít nhất 1 câu hỏi"
        onAdd={openBulkInsert}
      />
      {renderContent()}

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
    questionText: item.questionText,
    answers: item.answers,
    explanation: item.explanation || '',
    bankItemId: item._id,
  };
}

export default QuestionBankTab;
