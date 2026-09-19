import { QuizResultAdminItem } from '~mdDashboard/redux/RTKQuery/types';
import { PracticeSubmission } from '~mdDashboard/types/practice';
import { SubmissionListItem, SubmissionState } from '../redux/RTKQuery/type';

// Khớp PRACTICE_PASS_RATIO ở BE (practice.constants.ts): >= 80% mới đạt.
const PASS_RATIO = 0.8;

export const SUBMISSION_STATE: Record<
  SubmissionState,
  { label: string; color: string; bg: string }
> = {
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
  ungraded: {
    label: 'Chưa chấm',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
  },
};

export const practiceState = (total: number, max: number): SubmissionState => {
  if (!max) return 'ungraded';
  return total / max >= PASS_RATIO ? 'passed' : 'failed';
};

export const fromQuizResult = (r: QuizResultAdminItem): SubmissionListItem => ({
  id: r._id,
  learner: r.user ?? { fullName: r.userName },
  submittedAt: r.createdAt,
  scoreLabel: `${r.score}/10`,
  state: !r.totalQuestions ? 'ungraded' : r.isPass ? 'passed' : 'failed',
  isOverridden: false,
});

export const fromPracticeSubmission = (
  s: PracticeSubmission,
): SubmissionListItem => ({
  id: s._id,
  learner: typeof s.userId === 'object' ? s.userId : null,
  submittedAt: s.submittedAt,
  scoreLabel: `${s.totalScore}/${s.maxScore}`,
  state: practiceState(s.totalScore, s.maxScore),
  isOverridden: !!s.overriddenAt,
});

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
