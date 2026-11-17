// Mục luyện tập có trắc nghiệm ABCD - khớp BE: src/quiz/practice-subjects.ts
// và FE học viên: src/modules/dashboard/constants/practiceSubjects.ts.
export const PRACTICE_QUIZ_SUBJECTS = [{ value: 'ai', label: 'AI' }];

export const subjectLabel = (value?: string) =>
  PRACTICE_QUIZ_SUBJECTS.find(s => s.value === value)?.label ?? '';
