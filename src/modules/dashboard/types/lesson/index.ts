export interface Library {
  duration: number;
  _id: string;
  title: string;
  type: string;
  tags: any[];
  url: string;
  bulkId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  libraryType: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: 0;
  };
  __v: number;
}
