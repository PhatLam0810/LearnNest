// Kiểu dữ liệu cho tính năng thực hành Word/Excel (MOS practice exam) —
// dùng chung giữa module admin (soạn đề) và module dashboard (học viên làm bài).

export type PracticeSubject = 'Word' | 'Excel';

export const PRACTICE_CRITERIA_TYPES = [
  // Excel — dựa trên exceljs.
  'excel_cell_formula',
  'excel_cell_number_format',
  'excel_freeze_panes',
  'excel_column_width',
  'excel_cell_style',
  'excel_cell_value',
  // Word — dựa trên đọc XML thô (jszip).
  'word_line_spacing',
  'word_margins',
  'word_paragraph_style',
  'word_find_replace_result',
  'word_table_structure',
  'word_bookmark_exists',
] as const;

export type PracticeCriteriaType = (typeof PRACTICE_CRITERIA_TYPES)[number];

// Nhãn tiếng Việt dễ hiểu cho admin chọn khi soạn đề.
export const PRACTICE_CRITERIA_LABELS: Record<PracticeCriteriaType, string> = {
  excel_cell_formula: 'Công thức trong ô',
  excel_cell_number_format: 'Định dạng số của ô',
  excel_freeze_panes: 'Cố định hàng/cột (Freeze Panes)',
  excel_column_width: 'Độ rộng cột',
  excel_cell_style: 'Định dạng chữ/căn lề của ô',
  excel_cell_value: 'Giá trị trong ô',
  word_line_spacing: 'Giãn dòng của đoạn văn',
  word_margins: 'Lề trang',
  word_paragraph_style: 'Kiểu chữ (Style) của đoạn văn',
  word_find_replace_result: 'Nội dung tìm/thay thế trong văn bản',
  word_table_structure: 'Cấu trúc bảng (số hàng/cột)',
  word_bookmark_exists: 'Có Bookmark trong văn bản',
};

export interface PracticeTask {
  _id: string;
  subject: PracticeSubject;
  title: string;
  description?: string;
  starterFileUrl: string;
  assetFileUrls?: string[];
  lessonId?: string;
  moduleId?: string;
  order?: number;
  createdBy?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PracticeCriteria {
  _id?: string;
  taskId?: string;
  order?: number;
  type: PracticeCriteriaType;
  params: Record<string, any>;
  points: number;
  instructionOverride?: string;
}

export interface PracticeTaskDetail {
  task: PracticeTask;
  criteria: PracticeCriteria[];
}

export interface PracticeInstructionItem {
  criteriaId: string;
  instruction: string;
}

export interface PracticeSubmissionResultItem {
  criteriaId: string;
  passed: boolean;
  detail: string;
  // Hướng dẫn "Bước 1, 2, 3..." tự sinh — chỉ có ý nghĩa hiển thị cho học
  // viên khi passed=false; `detail` là mô tả kỹ thuật nội bộ, không hiển
  // thị trực tiếp cho học viên.
  instruction?: string;
}

export interface PracticeSubmitResponse {
  submissionId: string;
  totalScore: number;
  maxScore: number;
  items: PracticeSubmissionResultItem[];
}

export interface PracticeSubmissionUser {
  _id: string;
  fullName?: string;
  email?: string;
  studentId?: string;
  class?: string;
}

// 1 "khóa thực hành" = 1 Lesson thật (tái dùng Lesson/Module của khóa học
// video) có ít nhất 1 đề đã publish gắn lessonId — trang danh sách học viên
// hiển thị dạng thẻ khóa học thay vì liệt kê từng bài tập rời rạc.
export interface PracticeCourseSummary {
  lessonId: string;
  title: string;
  subject: PracticeSubject;
  taskCount: number;
}

export interface PracticeSubmission {
  _id: string;
  taskId: string;
  userId: string | PracticeSubmissionUser;
  fileUrl: string;
  submittedAt: string;
  totalScore: number;
  maxScore: number;
  results: PracticeSubmissionResultItem[];
}
