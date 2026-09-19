import { Module } from '~mdDashboard/redux/saga/type';
import { PracticeTask } from '~mdDashboard/types/practice';
import { TaskAccessibilitySeqItem } from '~mdDashboard/utils/isTaskAccessible';

export type ContentItem = TaskAccessibilitySeqItem & { order: number };

// Trộn bài học video (order = vị trí trong module.libraries[]) với bài
// thực hành thuộc module này (order = field riêng) thành 1 danh sách nội
// dung duy nhất, đúng thứ tự admin đã sắp xếp trong màn Phần học.
export const getModuleContentItems = (
  moduleItem: Module,
  tasks?: PracticeTask[],
): ContentItem[] => {
  const libraryItems = (moduleItem.libraries || []).map((l, i) => ({
    kind: 'library' as const,
    data: l,
    order: i,
  }));
  const taskItems = (tasks || [])
    .filter(t => t.moduleId === moduleItem._id)
    .map(t => ({ kind: 'task' as const, data: t, order: t.order ?? 0 }));
  return [...libraryItems, ...taskItems].sort((a, b) => a.order - b.order);
};

// Toàn bộ nội dung khóa học (video + bài thực hành) theo ĐÚNG 1 thứ tự
// duy nhất, nối các module lại theo đúng thứ tự module.
export const getLessonContentItems = (
  modules: Module[] | undefined,
  tasks?: PracticeTask[],
): ContentItem[] =>
  (modules || []).flatMap(m => getModuleContentItems(m, tasks));
