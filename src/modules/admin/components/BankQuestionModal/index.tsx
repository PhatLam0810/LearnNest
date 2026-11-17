'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { useResponsive } from '@/styles/responsive';
import { adminQuery } from '~mdAdmin/redux';
import type { QuestionBankItem } from '~mdAdmin/redux/RTKQuery/type';
import QuestionListEditor, {
  inferType,
  newQuestion,
  QuestionDraft,
  validateQuestions,
} from '../QuestionListEditor';
import styles from '../QuizBuilderModal/styles';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  // Có = sửa 1 câu trong ngân hàng; không có = thêm câu mới (nhiều câu / lần).
  editing?: QuestionBankItem;
}

const buttonStyle = { width: 'auto', height: 44 } as const;

// Thêm/sửa câu hỏi TRỰC TIẾP trong Ngân hàng câu hỏi, không cần tạo bài tập.
const BankQuestionModal: React.FC<Props> = ({
  isVisible,
  onClose,
  editing,
}) => {
  const { isMobile } = useResponsive();
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);
  const [create, { isLoading: isCreating }] =
    adminQuery.useCreateBankQuestionsMutation();
  const [update, { isLoading: isUpdating }] =
    adminQuery.useUpdateBankQuestionMutation();

  useEffect(() => {
    if (!isVisible) return;
    setQuestions(
      editing
        ? [
            {
              key: `bank-${editing._id}`,
              type: inferType(editing),
              questionText: editing.questionText,
              answers: editing.answers,
              explanation: editing.explanation || '',
            },
          ]
        : [newQuestion()],
    );
    setErrors({});
    setAttempted(false);
  }, [isVisible, editing]);

  useEffect(() => {
    if (attempted) setErrors(validateQuestions(questions));
  }, [questions, attempted]);

  const handleSave = async () => {
    setAttempted(true);
    const errs = validateQuestions(questions);
    setErrors(errs);
    if (questions.length === 0) {
      messageApi.error('Cần ít nhất 1 câu hỏi');
      return;
    }
    if (Object.keys(errs).length > 0) {
      messageApi.error('Vui lòng sửa các câu hỏi còn lỗi trước khi lưu');
      return;
    }
    const payload = questions.map(q => ({
      type: q.type,
      questionText: q.questionText,
      answers: q.answers,
      explanation: q.explanation || undefined,
    }));
    try {
      if (editing) {
        await update({ id: editing._id, body: payload[0] }).unwrap();
        messageApi.success('Đã cập nhật câu hỏi');
      } else {
        await create({ questions: payload }).unwrap();
        messageApi.success(`Đã thêm ${payload.length} câu hỏi vào ngân hàng`);
      }
      onClose();
    } catch (e: unknown) {
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Lưu câu hỏi thất bại',
      );
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={820}
      centered
      destroyOnHidden
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {editing ? 'Sửa câu hỏi' : 'Thêm câu hỏi vào ngân hàng'}
            </Text>
            <Text style={styles.subline}>
              Chọn dạng câu hỏi, soạn nội dung và đáp án. Có thể thêm nhiều câu
              một lần hoặc tạo từ ảnh/PDF/zip bằng AI.
            </Text>
          </View>
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            style={styles.closeButton as React.CSSProperties}>
            Đóng
          </button>
        </View>
        <View style={[styles.body, isMobile && styles.bodyMobile]}>
          <View style={{ gap: 16 }}>
            <QuestionListEditor
              questions={questions}
              onChange={setQuestions}
              errors={errors}
              isMobile={isMobile}
              single={!!editing}
            />
          </View>
          <View style={styles.footer}>
            <AppButton
              style={buttonStyle}
              disabled={isCreating || isUpdating}
              onClick={onClose}>
              Hủy
            </AppButton>
            <AppButton
              type="primary"
              style={buttonStyle}
              loading={isCreating || isUpdating}
              onClick={handleSave}>
              {editing ? 'Lưu thay đổi' : `Thêm ${questions.length} câu`}
            </AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BankQuestionModal;
