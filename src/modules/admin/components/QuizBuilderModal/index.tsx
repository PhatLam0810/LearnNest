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
import QuizAiDraftModal from '../QuizAiDraftModal';
import {
  blankNumbers,
  convertAnswers,
  maxAnswers,
  QUESTION_TYPE_LABEL,
  validateQuestionDraft,
} from '~mdAdmin/utils/questionTypes';
import AppButton from '@components/AppButton';
import { useAppPagination } from '@hooks';
import { useResponsive } from '@/styles/responsive';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import {
  CreateQuizPayload,
  DraftQuestion,
  QuestionType,
  Quiz,
} from '~mdAdmin/redux/RTKQuery/type';
import { Library } from '~mdDashboard/types';
import styles from './styles';

interface AnswerDraft {
  text: string;
  isCorrect: boolean;
  blankIndex?: number;
}

interface QuestionDraft {
  key: string;
  type: QuestionType;
  // AI không thấy đáp án đúng trong tài liệu -> nhắc admin kiểm tra.
  needsReview?: boolean;
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
const draftKey = () =>
  `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
// Câu cũ chưa có dạng: nhiều đáp án đúng thì coi là "chọn nhiều".
const inferType = (q: { type?: QuestionType; answers: AnswerDraft[] }) =>
  q.type ??
  (q.answers.filter(a => a.isCorrect).length > 1 ? 'multiple' : 'single');
const newQuestion = (): QuestionDraft => ({
  key: draftKey(),
  type: 'single',
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
  const [isAiOpen, setIsAiOpen] = useState(false);
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
          type: inferType(q),
          questionText: q.questionText,
          answers: q.answers,
          explanation: q.explanation || '',
        })),
      );
    } else {
      form.resetFields();
      setQuestions(
        (initialQuestions ?? []).map(q => ({ ...q, type: inferType(q) })),
      );
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
        q.key === key && q.answers.length < maxAnswers(q.type)
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

  // "Chọn 1 đáp án": tick đáp án nào thì bỏ tick các đáp án còn lại.
  const markSingleCorrect = (key: string, idx: number) =>
    setQuestions(prev =>
      prev.map(q =>
        q.key === key
          ? {
              ...q,
              answers: q.answers.map((a, i) => ({
                ...a,
                isCorrect: i === idx,
              })),
            }
          : q,
      ),
    );

  // Kéo thả: đáp án có số ô thì là đáp án đúng của ô đó, để trống là đáp án nhiễu.
  const setBlank = (key: string, idx: number, blank: number | null) =>
    patchAnswer(key, idx, {
      blankIndex: blank ?? undefined,
      isCorrect: blank !== null,
    });

  const changeType = (key: string, type: QuestionType) =>
    setQuestions(prev =>
      prev.map(q =>
        q.key === key
          ? {
              ...q,
              type,
              answers: convertAnswers(q.answers, type).slice(
                0,
                maxAnswers(type),
              ),
            }
          : q,
      ),
    );

  const addAiQuestions = (drafts: DraftQuestion[]) =>
    setQuestions(prev => [
      ...prev,
      ...drafts.map(d => ({
        key: draftKey(),
        type: d.type,
        needsReview: d.needsReview,
        questionText: d.questionText,
        answers: d.answers,
        explanation: d.explanation || '',
      })),
    ]);

  const validateQuestions = (list: QuestionDraft[]) => {
    const errs: Record<string, string> = {};
    list.forEach(q => {
      const error = validateQuestionDraft(q);
      if (error) errs[q.key] = error;
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
        type: q.type,
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
                      <Select<QuestionType>
                        value={q.type}
                        style={styles.typeSelect}
                        aria-label="Dạng câu hỏi"
                        options={(
                          Object.keys(QUESTION_TYPE_LABEL) as QuestionType[]
                        ).map(t => ({
                          value: t,
                          label: QUESTION_TYPE_LABEL[t],
                        }))}
                        onChange={t => changeType(q.key, t)}
                      />
                      <Input
                        value={q.questionText}
                        placeholder={
                          q.type === 'dragdrop'
                            ? 'Nội dung câu hỏi, dùng {{1}}, {{2}}... cho ô trống'
                            : 'Nhập nội dung câu hỏi'
                        }
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
                            {q.type === 'dragdrop' ? (
                              <Select<number>
                                allowClear
                                value={a.blankIndex}
                                placeholder="Nhiễu"
                                aria-label="Ô trống của đáp án này"
                                style={styles.blankSelect}
                                options={[
                                  ...new Set(blankNumbers(q.questionText)),
                                ]
                                  .sort((x, y) => x - y)
                                  .map(n => ({ value: n, label: `Ô ${n}` }))}
                                onChange={v =>
                                  setBlank(q.key, aIndex, v ?? null)
                                }
                                onClear={() => setBlank(q.key, aIndex, null)}
                              />
                            ) : (
                              <Checkbox
                                checked={a.isCorrect}
                                aria-label={`Đáp án ${aIndex + 1} đúng`}
                                onChange={e =>
                                  q.type === 'single'
                                    ? markSingleCorrect(q.key, aIndex)
                                    : patchAnswer(q.key, aIndex, {
                                        isCorrect: e.target.checked,
                                      })
                                }
                              />
                            )}
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
                        {q.answers.length < maxAnswers(q.type) && (
                          <Button
                            type="dashed"
                            block
                            icon={<PlusOutlined />}
                            onClick={() => addAnswer(q.key)}>
                            Thêm đáp án
                          </Button>
                        )}
                      </View>

                      {q.type === 'dragdrop' && (
                        <Text style={styles.hintText}>
                          Ô trống viết {'{{1}}'}, {'{{2}}'}... trong nội dung
                          câu hỏi. Chọn số ô cho đáp án đúng; để trống là đáp án
                          gây nhiễu.
                        </Text>
                      )}
                      {q.needsReview && (
                        <Text style={styles.warnText}>
                          AI không thấy đáp án đúng trong tài liệu - hãy kiểm
                          tra lại đáp án.
                        </Text>
                      )}
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
                <Button
                  block
                  style={styles.addQuestionButton}
                  onClick={() => setIsAiOpen(true)}>
                  Tạo câu hỏi từ ảnh / PDF / zip bằng AI
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
      <QuizAiDraftModal
        isVisible={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onUse={addAiQuestions}
      />
    </Modal>
  );
};

export default QuizBuilderModal;
