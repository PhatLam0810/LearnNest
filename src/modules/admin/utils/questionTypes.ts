import type { QuestionType, QuizAnswer } from '~mdAdmin/redux/RTKQuery/type';

// Phải khớp BE: BE-api/src/quiz/question-types.ts (BE vẫn kiểm lại khi lưu).
export const MAX_ANSWERS_CHOICE = 6;
export const MAX_ANSWERS_DRAGDROP = 10;

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  single: 'Chọn 1 đáp án đúng',
  multiple: 'Chọn nhiều đáp án đúng',
  dragdrop: 'Kéo thả vào ô trống',
};

export const blankNumbers = (text: string): number[] =>
  [...text.matchAll(/\{\{\s*(\d+)\s*\}\}/g)].map(m => Number(m[1]));

export const maxAnswers = (type: QuestionType) =>
  type === 'dragdrop' ? MAX_ANSWERS_DRAGDROP : MAX_ANSWERS_CHOICE;

// Đổi dạng câu hỏi mà giữ được nhiều nhất có thể: chọn 1 chỉ giữ đáp án đúng
// đầu tiên; sang kéo thả thì bỏ đánh dấu đúng (admin gắn lại số ô).
export function convertAnswers(
  answers: QuizAnswer[],
  to: QuestionType,
): QuizAnswer[] {
  if (to === 'dragdrop') {
    return answers.map(a => ({ text: a.text, isCorrect: false }));
  }
  let seen = false;
  return answers.map(a => {
    const isCorrect = a.isCorrect && (to === 'multiple' || !seen);
    if (isCorrect) seen = true;
    return { text: a.text, isCorrect };
  });
}

// Trả lỗi tiếng Việt hoặc null. Cùng luật với BE.
export function validateQuestionDraft(q: {
  type: QuestionType;
  questionText: string;
  answers: QuizAnswer[];
}): string | null {
  if (!q.questionText.trim()) return 'Vui lòng nhập nội dung câu hỏi';
  if (q.answers.some(a => !a.text.trim())) {
    return 'Vui lòng nhập đầy đủ nội dung đáp án';
  }
  const correct = q.answers.filter(a => a.isCorrect).length;
  if (q.type === 'single') {
    return correct === 1 ? null : 'Cần chọn đúng 1 đáp án đúng';
  }
  if (q.type === 'multiple') {
    return correct >= 2 ? null : 'Cần chọn ít nhất 2 đáp án đúng';
  }
  const blanks = blankNumbers(q.questionText);
  const unique = [...new Set(blanks)].sort((a, b) => a - b);
  if (unique.length === 0) {
    return 'Đề kéo thả cần ít nhất 1 ô trống, viết dạng {{1}}, {{2}}...';
  }
  if (unique.length !== blanks.length || unique.some((n, i) => n !== i + 1)) {
    return 'Ô trống phải đánh số liên tục từ {{1}} và không trùng nhau';
  }
  for (const n of unique) {
    const owners = q.answers.filter(a => a.isCorrect && a.blankIndex === n);
    if (owners.length !== 1) return `Ô trống {{${n}}} cần đúng 1 đáp án đúng`;
  }
  const stray = q.answers.some(
    a =>
      (a.isCorrect && !unique.includes(a.blankIndex ?? -1)) ||
      (!a.isCorrect && a.blankIndex !== undefined),
  );
  return stray ? 'Có đáp án gắn với ô trống không tồn tại' : null;
}
