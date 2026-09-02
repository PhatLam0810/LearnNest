export interface Library {
  duration: number;
  _id: string;
  title: string;
  type: string;
  tags: any[];
  url: string;
  // Chỉ dùng cho type='PDF': cho phép học viên tải/in tài liệu. Mặc định true.
  allowDownload?: boolean;
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
  usersCanPlay: UserId[];
  questionList: questionItem[];
}

interface UserId {
  _id: string;
}

type questionItem = {
  _id: string;
  question: string;
  answerList: string[];
  appearTime: number;
  correctAnswer: string;
};
