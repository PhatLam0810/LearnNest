// Trang Luyện tập: tab MOS cố định (thực hành Word/Excel), các tab còn lại là
// mục trắc nghiệm ABCD do admin tự thêm (AI, Tiếng Anh...).
export interface PracticeHubTab {
  key: string;
  label: string;
  // Có = mục trắc nghiệm (liệt kê bài theo mục này); không có = MOS.
  quizSubject?: string;
}

export const MOS_TAB: PracticeHubTab = { key: 'mos', label: 'MOS' };
export const DEFAULT_PRACTICE_TAB = MOS_TAB.key;
