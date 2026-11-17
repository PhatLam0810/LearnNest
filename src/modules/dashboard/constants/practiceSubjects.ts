// Các mục của trang Luyện tập. Thêm mục mới = thêm 1 dòng ở đây + 1 dòng ở BE
// (src/quiz/practice-subjects.ts) + 1 lựa chọn ở admin
// (src/modules/admin/utils/practiceSubjects.ts).
export interface PracticeHubTab {
  key: string;
  label: string;
  // Có = mục trắc nghiệm ABCD (liệt kê bài theo mục này); không có = mục MOS
  // dùng trang thực hành Word/Excel riêng.
  quizSubject?: string;
}

export const PRACTICE_HUB_TABS: PracticeHubTab[] = [
  { key: 'mos', label: 'MOS' },
  { key: 'ai', label: 'AI', quizSubject: 'ai' },
];

export const DEFAULT_PRACTICE_TAB = PRACTICE_HUB_TABS[0].key;
