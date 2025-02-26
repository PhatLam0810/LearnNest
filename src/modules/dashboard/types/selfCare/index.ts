export interface SelfCareItem {
  _id: string;
  date: string;
  userId: string;
  __v: number;
  isRead: boolean;
  selfCare: SelfCare;
}

export interface SelfCare {
  _id: string;
  title: string;
  type: string;
  duration: number;
  tags: any[];
  url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
