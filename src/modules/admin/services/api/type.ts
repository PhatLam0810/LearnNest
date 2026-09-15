export type QuestionUser = {
  _id?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
};

export interface QuestionItem {
  _id: string;
  postId: string;
  type: string;
  commentText: string;
  user?: QuestionUser;
  createdAt: string;
  link?: string;
  contextTitle?: string;
  isAnswered?: boolean;
  dismissedAt?: string | null;
}

export interface QuestionStats {
  openCount: number;
  overdueCount: number;
  avgResponseHours: number | null;
}

export interface AnswerInfo {
  fullName?: string;
  commentText: string;
  createdAt: string;
}

export interface ReplyQuestionParams {
  postId: string;
  type: string;
  commentText: string;
  parentCommentId: string;
}
