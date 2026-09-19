import { Module } from '~mdDashboard/redux/saga/type';
import { PracticeTask } from '~mdDashboard/types/practice';
import { TaskAccessibilitySeqItem } from '~mdDashboard/utils/isTaskAccessible';

export type CurriculumRailProps = {
  modules: Module[];
  tasks?: PracticeTask[];
  videoCompletedBySubLesson?: Record<string, boolean>;
  quizPassedByLibrary?: Record<string, boolean>;
  isAdmin: boolean;
  currentUserId?: string;
  // Mục đang mở — id rỗng nghĩa là chưa chọn mục nào.
  selected: { kind: 'library' | 'task'; id: string };
  onSelect: (entry: TaskAccessibilitySeqItem) => void;
};
