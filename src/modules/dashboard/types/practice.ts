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
  'excel_wrap_text',
  'excel_table_name',
  'excel_table_banded_rows',
  // Excel — đọc XML thô (chart/sparkline, exceljs không hỗ trợ).
  'excel_sparkline_exists',
  'excel_chart_title',
  'excel_chart_axis_title',
  'excel_chart_data_labels',
  'excel_table_converted_to_range',
  // Word — dựa trên đọc XML thô (jszip).
  'word_line_spacing',
  'word_margins',
  'word_paragraph_style',
  'word_find_replace_result',
  'word_table_structure',
  'word_bookmark_exists',
  'word_header_different_first_page',
  'word_symbol_inserted',
  'word_table_cell_spacing',
  'word_footnotes_to_endnotes',
  'word_text_shadow_color',
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
  excel_wrap_text: 'Tự động ngắt dòng (Wrap Text)',
  excel_table_name: 'Tên bảng (Table Name)',
  excel_table_banded_rows: 'Tô bóng hàng xen kẽ (Banded Rows)',
  excel_sparkline_exists: 'Sparkline',
  excel_chart_title: 'Tiêu đề biểu đồ',
  excel_chart_axis_title: 'Tiêu đề trục biểu đồ',
  excel_chart_data_labels: 'Nhãn dữ liệu biểu đồ (Data Labels)',
  excel_table_converted_to_range: 'Chuyển bảng thành vùng (Convert to Range)',
  word_header_different_first_page: 'Header khác trang đầu',
  word_symbol_inserted: 'Chèn ký hiệu (Symbol)',
  word_table_cell_spacing: 'Khoảng cách giữa các ô trong bảng',
  word_footnotes_to_endnotes: 'Chuyển chú thích cuối trang → cuối văn bản',
  word_text_shadow_color: 'Hiệu ứng chữ (đổ bóng + màu)',
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
  // Tên phần học moduleId đang trỏ tới — backend tra sẵn, chỉ để hiển thị
  // (VD: cảnh báo "đang thuộc phần khác" trong picker chọn bài thực hành).
  moduleTitle?: string;
  order?: number;
  createdBy?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Chỉ có khi API được gọi từ phía học viên (đã đăng nhập) — đã có lần nộp
  // nào đạt >= 80% số điểm chưa. Dùng để mở khóa nội dung tiếp theo trong
  // khóa học, y hệt cơ chế usersCanPlay của Library nhưng cho bài thực hành.
  hasPassed?: boolean;
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
  // true nếu totalScore/maxScore >= 80% — đủ điều kiện mở khóa nội dung
  // tiếp theo trong khóa học.
  isPass: boolean;
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
