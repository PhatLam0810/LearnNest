'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import QuestionListEditor, {
  inferType,
  QuestionDraft,
  validateQuestions,
} from '../QuestionListEditor';
import AppButton from '@components/AppButton';
import { useAppPagination } from '@hooks';
import { useResponsive } from '@/styles/responsive';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { CreateQuizPayload, Quiz } from '~mdAdmin/redux/RTKQuery/type';
import { Library } from '~mdDashboard/types';
import { usePracticeSubjects } from '~mdAdmin/utils/practiceSubjects';
import styles from './styles';

interface QuizBuilderModalProps {
  isVisible: boolean;
  onClose: () => void;
  editing?: Quiz;
  // Câu hỏi mồi khi mở builder từ "Chèn vào bài tập mới" ở tab Ngân hàng
  // câu hỏi - mỗi câu giữ bankItemId để BE tăng usageCount thay vì tạo bản
  // ghi bank trùng lặp (xem quiz.service.ts syncQuestionBank).
  initialQuestions?: QuestionDraft[];
  // Mở từ 1 bài học: gắn sẵn bài học đó (bài mới).
  presetLibrary?: { _id: string; title: string };
  // Mở từ tab của 1 mục luyện tập: gắn sẵn mục đó (bài mới).
  presetSubject?: string;
}

const buttonStyle = { width: 'auto', height: 44 } as const;

const QuizBuilderModal: React.FC<QuizBuilderModalProps> = ({
  isVisible,
  onClose,
  editing,
  initialQuestions,
  presetLibrary,
  presetSubject,
}) => {
  const isEdit = !!editing;
  const { options: subjectOptions } = usePracticeSubjects();
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
            : editing.libraryId?._id,
        subject: editing.subject,
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
      if (presetSubject) form.setFieldsValue({ subject: presetSubject });
      if (presetLibrary) form.setFieldsValue({ libraryId: presetLibrary._id });
      setQuestions(
        (initialQuestions ?? []).map(q => ({ ...q, type: inferType(q) })),
      );
    }
    setErrors({});
    setAttemptedSave(false);
  }, [isVisible, editing]);

  useEffect(() => {
    if (attemptedSave) setErrors(validateQuestions(questions));
  }, [questions, attemptedSave]);

  const handleFinish = async (values: {
    title: string;
    libraryId?: string;
    subject?: string;
    timeLimitMinutes?: number;
    passThresholdPercent: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
  }) => {
    setAttemptedSave(true);
    if (!values.libraryId && !values.subject) {
      messageApi.error('Chọn mục luyện tập hoặc gắn bài tập vào một bài học');
      return;
    }
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
      subject: values.subject,
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
                <QuestionListEditor
                  questions={questions}
                  onChange={setQuestions}
                  errors={errors}
                  isMobile={isMobile}
                />
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
                    label="Mục luyện tập"
                    name="subject"
                    extra="Hiện ở trang Luyện tập của học viên, đúng mục đã chọn.">
                    <Select
                      allowClear
                      placeholder="Chọn mục luyện tập"
                      options={subjectOptions}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Gắn vào bài học (không bắt buộc)"
                    name="libraryId"
                    extra="Cần chọn ít nhất mục luyện tập hoặc bài học.">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Chọn bài học"
                      filterOption={false}
                      onSearch={searchLibraries}
                      options={[
                        ...(presetLibrary ? [presetLibrary] : []),
                        ...(libraries || []).filter(
                          lib => lib._id !== presetLibrary?._id,
                        ),
                      ].map(lib => ({
                        value: lib._id,
                        label: lib.title,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Thời gian làm bài (phút)"
                    name="timeLimitMinutes"
                    extra="Điền số phút để thành ĐỀ THI THỬ có đồng hồ đếm ngược, hết giờ tự nộp. Để trống = bài luyện tập không giới hạn giờ.">
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
