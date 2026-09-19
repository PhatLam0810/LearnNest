import { ClassLearnerState, ClassOverviewItem } from '../redux/RTKQuery/type';

export type ClassStatus = 'unassigned' | 'open' | 'overdue' | 'done';

export const CLASS_STATUS: Record<
  ClassStatus,
  { label: string; color: string; bg: string }
> = {
  unassigned: {
    label: 'Chưa giao bài',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
  },
  open: {
    label: 'Đang mở',
    color: 'var(--color-info)',
    bg: 'var(--color-info-bg)',
  },
  overdue: {
    label: 'Quá hạn',
    color: 'var(--color-error)',
    bg: 'var(--color-error-bg)',
  },
  done: {
    label: 'Đã nộp đủ',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
  },
};

export const classStatus = (
  item: Pick<
    ClassOverviewItem,
    'assignment' | 'memberCount' | 'submittedCount'
  >,
  now = Date.now(),
): ClassStatus => {
  if (!item.assignment) return 'unassigned';
  if (item.memberCount > 0 && item.submittedCount >= item.memberCount) {
    return 'done';
  }
  return new Date(item.assignment.dueDate).getTime() < now ? 'overdue' : 'open';
};

export const LEARNER_STATE: Record<
  ClassLearnerState,
  { label: string; color: string; bg: string }
> = {
  not_submitted: {
    label: 'Chưa nộp',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
  },
  passed: {
    label: 'Đạt',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
  },
  failed: {
    label: 'Chưa đạt',
    color: 'var(--color-error)',
    bg: 'var(--color-error-bg)',
  },
};
