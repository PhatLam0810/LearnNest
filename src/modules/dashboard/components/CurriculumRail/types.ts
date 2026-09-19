import { Module } from '~mdDashboard/redux/saga/type';
import { PracticeTask } from '~mdDashboard/types/practice';
import { TaskAccessibilitySeqItem } from '~mdDashboard/utils/isTaskAccessible';

export type CurriculumRailProps = {
  modules: Module[];
  tasks?: PracticeTask[];
  videoCompletedBySubLesson?: Record<string, boolean>;
  quizPassedByLibrary?: Record<string, boolean>;
  // Id đã lưu của user (getBookmarkIds) — có mảng nào thì dòng tương ứng hiện
  // nút lưu bài; lessonId dùng dựng link mở lại đúng bài trong khóa.
  lessonId?: string;
  bookmarkedSubLessonIds?: string[];
  bookmarkedTaskIds?: string[];
  isAdmin: boolean;
  currentUserId?: string;
  // Mục đang mở — id rỗng nghĩa là chưa chọn mục nào.
  selected: { kind: 'library' | 'task'; id: string };
  onSelect: (entry: TaskAccessibilitySeqItem) => void;
};
