'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@components/AppIcon';
import AppButton from '@components/AppButton';
import { useAppPagination } from '@hooks';
import { useResponsive } from '@/styles/responsive';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { CreateQuizPayload, Quiz } from '~mdAdmin/redux/RTKQuery/type';
import { Library } from '~mdDashboard/types';
import styles from './styles';

interface AnswerDraft {
  text: string;
  isCorrect: boolean;
}

interface QuestionDraft {
  key: string;
  questionText: string;
  answers: AnswerDraft[];
  explanation: string;
  bankItemId?: string;
}

interface QuizBuilderModalProps {
  isVisible: boolean;
  onClose: () => void;
  editing?: Quiz;
  // Câu hỏi mồi khi mở builder từ "Chèn vào bài tập mới" ở tab Ngân hàng
  // câu hỏi - mỗi câu giữ bankItemId để BE tăng usageCount thay vì tạo bản
  // ghi bank trùng lặp (xem quiz.service.ts syncQuestionBank).
  initialQuestions?: QuestionDraft[];
}

const buttonStyle = { width: 'auto', height: 44 } as const;

const emptyAnswer = (): AnswerDraft => ({ text: '', isCorrect: false });
const newQuestion = (): QuestionDraft => ({
  key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  questionText: '',
  answers: [emptyAnswer(), emptyAnswer()],
  explanation: '',
});

const QuizBuilderModal: React.FC<QuizBuilderModalProps> = ({
  isVisible,
  onClose,
  editing,
  initialQuestions,
}) => {
  const isEdit = !!editing;
  const { isMobile } = useResponsive();
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSave, setAttemptedSave] = useState(false);
  const timeLimitMinutes = Form.useWatch('timeLimitMinutes', form);

  const { listItem: libraries, search: searchLibraries } =
    useAppPagination<Library>({ apiUrl: 'library/getAllLibrary' });

  const [createQuiz, { isLoading: isCreating }] =
    adminQuery.useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdating }] =
    adminQuery.useUpdateQuizMutation();

  useEffect(() => {
    if (!isVisible) return;
    if (editing) {
      form.setFieldsValue({
        title: editing.title,
        libraryId:
          typeof editing.libraryId === 'string'
            ? editing.libraryId
            : editing.libraryId._id,
        timeLimitMinutes: editing.timeLimitMinutes,
        passThresholdPercent: editing.passThresholdPercent,
        maxAttempts: editing.maxAttempts,
        shuffleQuestions: editing.shuffleQuestions,
      });
      setQuestions(
        editing.questions.map((q, i) => ({
          key: `edit-${i}`,
          questionText: q.questionText,
          answers: q.answers,
          explanation: q.explanation || '',
        })),
      );
    } else {
      form.resetFields();
      setQuestions(initialQuestions?.length ? initialQuestions : []);
    }
    setErrors({});
    setAttemptedSave(false);
  }, [isVisible, editing]);

  const addQuestion = () => setQuestions(prev => [...prev, newQuestion()]);
  const removeQuestion = (key: string) =>
    setQuestions(prev => prev.filter(q => q.key !== key));
  const patchQuestion = (key: string, patch: Partial<QuestionDraft>) =>
    setQuestions(prev =>
      prev.map(q => (q.key === key ? { ...q, ...patch } : q)),
    );

  const addAnswer = (key: string) =>
    setQuestions(prev =>
      prev.map(q =>
        q.key === key && q.answers.length < 6
          ? { ...q, answers: [...q.answers, emptyAnswer()] }
          : q,
      ),
    );
  const removeAnswer = (key: string, idx: number) =>
    setQuestions(prev =>
      prev.map(q =>
        q.key === key && q.answers.length > 2
          ? { ...q, answers: q.answers.filter((_, i) => i !== idx) }
          : q,
      ),
    );
  const patchAnswer = (key: string, idx: number, patch: Partial<AnswerDraft>) =>
    setQuestions(prev =>
      prev.map(q =>
        q.key === key
          ? {
              ...q,
              answers: q.answers.map((a, i) =>
                i === idx ? { ...a, ...patch } : a,
              ),
            }
          : q,
      ),
    );

  const validateQuestions = (list: QuestionDraft[]) => {
    const errs: Record<string, string> = {};
    list.forEach(q => {
      if (!q.questionText.trim()) {
        errs[q.key] = 'Vui lòng nhập nội dung câu hỏi';
      } else if (q.answers.some(a => !a.text.trim())) {
        errs[q.key] = 'Vui lòng nhập đầy đủ nội dung đáp án';
      } else if (!q.answers.some(a => a.isCorrect)) {
        errs[q.key] = 'Cần chọn ít nhất 1 đáp án đúng';
      }
    });
    return errs;
  };

  useEffect(() => {
    if (attemptedSave) setErrors(validateQuestions(questions));
  }, [questions, attemptedSave]);

  const handleFinish = async (values: {
    title: string;
    libraryId: string;
    timeLimitMinutes?: number;
    passThresholdPercent: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
  }) => {
    setAttemptedSave(true);
    const errs = validateQuestions(questions);
    setErrors(errs);
    if (questions.length === 0) {
      messageApi.error('Bài tập cần ít nhất 1 câu hỏi');
      return;
    }
    if (Object.keys(errs).length > 0) {
      messageApi.error('Vui lòng sửa các câu hỏi còn lỗi trước khi lưu');
      return;
    }

    const payload: CreateQuizPayload = {
      title: values.title,
      libraryId: values.libraryId,
      questions: questions.map(q => ({
        questionText: q.questionText,
        answers: q.answers,
        explanation: q.explanation || undefined,
        bankItemId: q.bankItemId,
      })),
      timeLimitMinutes: values.timeLimitMinutes,
      passThresholdPercent: values.passThresholdPercent,
      maxAttempts: values.maxAttempts,
      shuffleQuestions: !!values.shuffleQuestions,
    };

    try {
      if (isEdit) {
        await updateQuiz({ id: editing!._id, body: payload }).unwrap();
        messageApi.success('Đã cập nhật bài tập');
      } else {
        await createQuiz(payload).unwrap();
        messageApi.success('Đã tạo bài tập');
      }
      onClose();
    } catch (e: unknown) {
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Lưu bài tập thất bại',
      );
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={1120}
      centered
      destroyOnHidden
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {isEdit ? `Cập nhật: ${editing?.title}` : 'Tạo bài tập'}
            </Text>
            <Text style={styles.subline}>
              Soạn câu hỏi ở bên trái, thiết lập bài tập ở bên phải.
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
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <View style={[styles.grid, isMobile && styles.gridMobile]}>
              <View style={styles.leftCol}>
                {questions.length === 0 && (
                  <View style={styles.emptyQuestions}>
                    <Text style={styles.emptyQuestionsText}>
                      Chưa có câu hỏi nào — bấm &quot;Thêm câu hỏi&quot; để bắt
                      đầu.
                    </Text>
                  </View>
                )}
                {questions.map((q, qIndex) => (
                  <View
                    key={q.key}
                    style={[
                      styles.questionCard,
                      isMobile && styles.questionCardMobile,
                    ]}>
                    <View style={styles.questionHeader}>
                      <View style={styles.indexBadge}>
                        <Text style={styles.indexBadgeText}>{qIndex + 1}</Text>
                      </View>
                      <Input
                        value={q.questionText}
                        placeholder="Nhập nội dung câu hỏi"
                        style={styles.questionInput}
                        onChange={e =>
                          patchQuestion(q.key, { questionText: e.target.value })
                        }
                      />
                      <Button
                        style={styles.removeQuestionButton}
                        onClick={() => removeQuestion(q.key)}>
                        <DeleteOutlined
                          style={{ color: 'var(--color-text-on-primary)' }}
                        />
                      </Button>
                    </View>

                    <View
                      style={[
                        styles.answerBlock,
                        isMobile && styles.answerBlockMobile,
                      ]}>
                      <View style={styles.answersList}>
                        {q.answers.map((a, aIndex) => (
                          <View key={aIndex} style={styles.answerRow}>
                            <Checkbox
                              checked={a.isCorrect}
                              onChange={e =>
                                patchAnswer(q.key, aIndex, {
                                  isCorrect: e.target.checked,
                                })
                              }
                            />
                            <Input
                              value={a.text}
                              placeholder={`Đáp án ${aIndex + 1}`}
                              style={styles.answerInput}
                              onChange={e =>
                                patchAnswer(q.key, aIndex, {
                                  text: e.target.value,
                                })
                              }
                            />
                            <Button
                              style={styles.answerDeleteButton}
                              disabled={q.answers.length <= 2}
                              onClick={() => removeAnswer(q.key, aIndex)}>
                              <DeleteOutlined
                                style={{
                                  color: 'var(--color-text-on-primary)',
                                }}
                              />
                            </Button>
                          </View>
                        ))}
                        {q.answers.length < 6 && (
                          <Button
                            type="dashed"
                            block
                            icon={<PlusOutlined />}
                            onClick={() => addAnswer(q.key)}>
                            Thêm đáp án
                          </Button>
                        )}
                      </View>

                      {errors[q.key] && (
                        <Text style={styles.errorText}>{errors[q.key]}</Text>
                      )}

                      <Input.TextArea
                        value={q.explanation}
                        placeholder="Giải thích (hiện cho học viên sau khi nộp bài, không bắt buộc)"
                        rows={2}
                        onChange={e =>
                          patchQuestion(q.key, { explanation: e.target.value })
                        }
                      />
                    </View>
                  </View>
                ))}
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  style={styles.addQuestionButton}
                  onClick={addQuestion}>
                  Thêm câu hỏi
                </Button>
              </View>

              <View style={styles.rightCol}>
                <View
                  style={[
                    styles.settingsPanel,
                    isMobile && styles.settingsPanelMobile,
                  ]}>
                  <Form.Item
                    label="Tên bài tập"
                    name="title"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên bài tập' },
                    ]}>
                    <Input placeholder="Nhập tên bài tập" />
                  </Form.Item>
                  <Form.Item
                    label="Gắn vào bài học"
                    name="libraryId"
                    rules={[
                      { required: true, message: 'Vui lòng chọn bài học' },
                    ]}>
                    <Select
                      showSearch
                      placeholder="Chọn bài học"
                      filterOption={false}
                      onSearch={searchLibraries}
                      options={(libraries || []).map(lib => ({
                        value: lib._id,
                        label: lib.title,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Thời gian làm bài (phút)"
                    name="timeLimitMinutes">
                    <InputNumber min={1} style={styles.fullWidth} />
                  </Form.Item>
                  <Form.Item
                    label="Điểm đạt tối thiểu (%)"
                    name="passThresholdPercent"
                    initialValue={60}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập điểm đạt tối thiểu',
                      },
                    ]}>
                    <InputNumber min={0} max={100} style={styles.fullWidth} />
                  </Form.Item>
                  <Form.Item label="Số lần làm lại" name="maxAttempts">
                    <InputNumber
                      min={1}
                      style={styles.fullWidth}
                      placeholder="Không giới hạn"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Trộn thứ tự câu hỏi"
                    name="shuffleQuestions"
                    valuePropName="checked">
                    <Switch />
                  </Form.Item>

                  <View style={styles.summaryBox}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Số câu</Text>
                      <Text style={styles.summaryValue}>
                        {questions.length}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Tổng điểm</Text>
                      <Text style={styles.summaryValue}>100</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Thời gian</Text>
                      <Text style={styles.summaryValue}>
                        {timeLimitMinutes || '—'} phút
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
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
                htmlType="submit"
                style={buttonStyle}
                loading={isCreating || isUpdating}>
                Xác nhận
              </AppButton>
            </View>
          </Form>
        </View>
      </View>
    </Modal>
  );
};

export default QuizBuilderModal;
