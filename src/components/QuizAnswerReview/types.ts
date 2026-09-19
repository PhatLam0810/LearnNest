export interface QuizAnswerReviewQuestion {
  _id: string;
  question: string;
  answerList: string[];
  // null = câu bỏ trống ở màn học viên, không có đáp án để tô.
  correctAnswer: string | null;
  // Chữ cái A/B/C/D học viên chọn; null = bỏ trống.
  selected: string | null;
}

export interface QuizAnswerReviewProps {
  questions: QuizAnswerReviewQuestion[];
  // Ngôi người làm bài trong nhãn: admin xem bài của người khác ("Học viên"),
  // học viên xem bài của mình ("Bạn").
  chooserLabel?: string;
}
