import {
  ClassLearnerState,
  ClassOverviewItem,
  ClassStatusValue,
} from '../redux/RTKQuery/type';

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

// Đọc lỗi 4xx của BE ({message: string | string[]}) thành 1 chuỗi hiển thị.
export const apiErrorMessage = (err: unknown, fallback: string): string => {
  const message = (err as { data?: { message?: string | string[] } })?.data
    ?.message;
  return (Array.isArray(message) ? message.join('. ') : message) || fallback;
};

export const CLASS_ENTITY_STATUS: Record<
  ClassStatusValue,
  { label: string; color: string; bg: string }
> = {
  active: {
    label: 'Đang hoạt động',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
  },
  archived: {
    label: 'Đã lưu trữ',
    color: 'var(--color-text-muted)',
    bg: 'var(--color-surface-subtle)',
  },
};
