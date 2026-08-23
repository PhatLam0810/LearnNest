export interface FeedbackItem {
  _id: string;
  fullName: string;
  email: string;
  content: string;
  images: string[];
  userId?: string;
  createdAt: string;
  updatedAt: string;
}
