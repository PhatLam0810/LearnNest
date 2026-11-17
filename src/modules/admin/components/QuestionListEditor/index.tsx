'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Checkbox, Input, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@components/AppIcon';
import type { DraftQuestion, QuestionType } from '~mdAdmin/redux/RTKQuery/type';
import {
  blankNumbers,
  convertAnswers,
  maxAnswers,
  QUESTION_TYPE_LABEL,
  validateQuestionDraft,
} from '~mdAdmin/utils/questionTypes';
import QuizAiDraftModal from '../QuizAiDraftModal';
import styles from '../QuizBuilderModal/styles';

export interface AnswerDraft {
  text: string;
  isCorrect: boolean;
  blankIndex?: number;
}

export interface QuestionDraft {
  key: string;
  type: QuestionType;
  // AI không thấy đáp án đúng trong tài liệu -> nhắc admin kiểm tra.
  needsReview?: boolean;
  questionText: string;
  answers: AnswerDraft[];
  explanation: string;
  bankItemId?: string;
}

export const draftKey = () =>
  `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Câu cũ chưa có dạng: nhiều đáp án đúng thì coi là "chọn nhiều".
export const inferType = (q: {
  type?: QuestionType;
  answers: AnswerDraft[];
}): QuestionType =>
  q.type ??
  (q.answers.filter(a => a.isCorrect).length > 1 ? 'multiple' : 'single');

const emptyAnswer = (): AnswerDraft => ({ text: '', isCorrect: false });
export const newQuestion = (): QuestionDraft => ({
  key: draftKey(),
  type: 'single',
  questionText: '',
  answers: [emptyAnswer(), emptyAnswer()],
  explanation: '',
});

export const validateQuestions = (list: QuestionDraft[]) => {
  const errs: Record<string, string> = {};
  list.forEach(q => {
    const error = validateQuestionDraft(q);
    if (error) errs[q.key] = error;
  });
  return errs;
};

interface Props {
  questions: QuestionDraft[];
  onChange: React.Dispatch<React.SetStateAction<QuestionDraft[]>>;
  errors: Record<string, string>;
  isMobile?: boolean;
  // Chỉ 1 câu (sửa câu trong ngân hàng): ẩn nút thêm/xoá câu.
  single?: boolean;
}

// Soạn danh sách câu hỏi (3 dạng + tạo từ ảnh/zip bằng AI). Dùng chung cho
// trình soạn bài tập và cho thêm/sửa câu trực tiếp trong Ngân hàng câu hỏi.
const QuestionListEditor: React.FC<Props> = ({
  questions,
  onChange,
  errors,
  isMobile,
  single,
}) => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  const mapQuestion = (key: string, fn: (q: QuestionDraft) => QuestionDraft) =>
    onChange(prev => prev.map(q => (q.key === key ? fn(q) : q)));
  const patchQuestion = (key: string, patch: Partial<QuestionDraft>) =>
    mapQuestion(key, q => ({ ...q, ...patch }));
  const patchAnswer = (key: string, idx: number, patch: Partial<AnswerDraft>) =>
    mapQuestion(key, q => ({
      ...q,
      answers: q.answers.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
    }));
  const addAnswer = (key: string) =>
    mapQuestion(key, q =>
      q.answers.length < maxAnswers(q.type)
        ? { ...q, answers: [...q.answers, emptyAnswer()] }
        : q,
    );
  const removeAnswer = (key: string, idx: number) =>
    mapQuestion(key, q =>
      q.answers.length > 2
        ? { ...q, answers: q.answers.filter((_, i) => i !== idx) }
        : q,
    );
  // "Chọn 1 đáp án": tick đáp án nào thì bỏ tick các đáp án còn lại.
  const markSingleCorrect = (key: string, idx: number) =>
    mapQuestion(key, q => ({
      ...q,
      answers: q.answers.map((a, i) => ({ ...a, isCorrect: i === idx })),
    }));
  // Kéo thả: đáp án có số ô thì là đáp án đúng của ô đó, để trống là nhiễu.
  const setBlank = (key: string, idx: number, blank: number | null) =>
    patchAnswer(key, idx, {
      blankIndex: blank ?? undefined,
      isCorrect: blank !== null,
    });
  const changeType = (key: string, type: QuestionType) =>
    mapQuestion(key, q => ({
      ...q,
      type,
      answers: convertAnswers(q.answers, type).slice(0, maxAnswers(type)),
    }));
  const addAiQuestions = (drafts: DraftQuestion[]) =>
    onChange(prev => [
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

  return (
    <>
      {questions.length === 0 && (
        <View style={styles.emptyQuestions}>
          <Text style={styles.emptyQuestionsText}>
            Chưa có câu hỏi nào — bấm &quot;Thêm câu hỏi&quot; để bắt đầu.
          </Text>
        </View>
      )}
      {questions.map((q, qIndex) => (
        <View
          key={q.key}
          style={[styles.questionCard, isMobile && styles.questionCardMobile]}>
          <View style={styles.questionHeader}>
            <View style={styles.indexBadge}>
              <Text style={styles.indexBadgeText}>{qIndex + 1}</Text>
            </View>
            <Select<QuestionType>
              value={q.type}
              style={styles.typeSelect}
              aria-label="Dạng câu hỏi"
              options={(Object.keys(QUESTION_TYPE_LABEL) as QuestionType[]).map(
                t => ({ value: t, label: QUESTION_TYPE_LABEL[t] }),
              )}
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
            {!single && (
              <Button
                style={styles.removeQuestionButton}
                aria-label="Xoá câu hỏi"
                onClick={() =>
                  onChange(prev => prev.filter(x => x.key !== q.key))
                }>
                <DeleteOutlined
                  style={{ color: 'var(--color-text-on-primary)' }}
                />
              </Button>
            )}
          </View>

          <View
            style={[styles.answerBlock, isMobile && styles.answerBlockMobile]}>
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
                      options={[...new Set(blankNumbers(q.questionText))]
                        .sort((x, y) => x - y)
                        .map(n => ({ value: n, label: `Ô ${n}` }))}
                      onChange={v => setBlank(q.key, aIndex, v ?? null)}
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
                      patchAnswer(q.key, aIndex, { text: e.target.value })
                    }
                  />
                  <Button
                    style={styles.answerDeleteButton}
                    aria-label="Xoá đáp án"
                    disabled={q.answers.length <= 2}
                    onClick={() => removeAnswer(q.key, aIndex)}>
                    <DeleteOutlined
                      style={{ color: 'var(--color-text-on-primary)' }}
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
                Ô trống viết {'{{1}}'}, {'{{2}}'}... trong nội dung câu hỏi.
                Chọn số ô cho đáp án đúng; để trống là đáp án gây nhiễu.
              </Text>
            )}
            {q.needsReview && (
              <Text style={styles.warnText}>
                AI không thấy đáp án đúng trong tài liệu - hãy kiểm tra lại đáp
                án.
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
      {!single && (
        <>
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            style={styles.addQuestionButton}
            onClick={() => onChange(prev => [...prev, newQuestion()])}>
            Thêm câu hỏi
          </Button>
          <Button
            block
            style={styles.addQuestionButton}
            onClick={() => setIsAiOpen(true)}>
            Tạo câu hỏi từ ảnh / PDF / zip bằng AI
          </Button>
          <QuizAiDraftModal
            isVisible={isAiOpen}
            onClose={() => setIsAiOpen(false)}
            onUse={addAiQuestions}
          />
        </>
      )}
    </>
  );
};

export default QuestionListEditor;
