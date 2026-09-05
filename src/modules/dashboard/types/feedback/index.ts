export type FeedbackCategory =
  'content' | 'bug' | 'suggestion' | 'grading' | 'other';

export interface FeedbackItem {
  _id: string;
  fullName: string;
  email: string;
  content: string;
  images: string[];
  userId?: string;
  category?: FeedbackCategory;
  status?: 'pending' | 'resolved';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}
