export type AuditLogItem = {
  _id: string;
  actorName?: string;
  actorEmail?: string;
  action: string;
  targetId?: string;
  status: 'success' | 'error';
  errorMessage?: string;
  meta?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: string;
};

export const ACTION_LABEL: Record<string, string> = {
  'user.create': 'Tạo người dùng',
  'user.delete': 'Xóa người dùng',
  'user.role.grant': 'Cấp quyền admin',
  'user.role.revoke': 'Gỡ quyền admin',
  'user.import.bulk': 'Import hàng loạt người dùng',
  'practiceTask.update': 'Sửa đề thực hành',
  'practiceTask.delete': 'Xóa đề thực hành',
  'admin.email.remindBulk': 'Gửi email nhắc nhở hàng loạt',
  'admin.email.remindNotWatched': 'Gửi email nhắc xem video',
  'admin.email.remindNotPassedTask': 'Gửi email nhắc làm lại bài thực hành',
  'admin.email.remindNotPassedQuiz': 'Gửi email nhắc làm lại trắc nghiệm',
  'admin.email.sendPracticeClass': 'Gửi email thông báo lớp thực hành',
};

// Dịch từng field trong `meta` sang tiếng Việt dễ hiểu — khớp đúng các key
// mà AUDIT_PICKERS/AUDIT_RESULT_PICKERS (BE) tạo ra, xem audit.actions.ts.
// Field lạ (action mới thêm sau quên cập nhật ở đây) vẫn hiện được, chỉ là
// giữ nguyên tên key.
export const META_FIELD_LABEL: Record<string, string> = {
  email: 'Email',
  studentId: 'Mã số sinh viên',
  fullName: 'Họ và tên',
  roleLevel: 'Cấp quyền',
  roleId: 'Mã vai trò',
  lessonId: 'Mã khóa học',
  subLessonId: 'Mã video',
  libraryId: 'Mã bài trắc nghiệm',
  classId: 'Mã lớp thực hành',
  totalEligible: 'Số người đủ điều kiện nhận',
  sent: 'Đã gửi',
  failed: 'Thất bại',
  targetUserId: 'Người dùng bị tác động (mã)',
  targetUserName: 'Người dùng bị tác động',
  targetUserEmail: 'Email người dùng bị tác động',
  targetTaskId: 'Đề thực hành (mã)',
  targetTaskTitle: 'Đề thực hành',
  targetTaskSubject: 'Môn',
};

// Field đã hiện riêng ở card "Đối tượng" trong modal — không lặp lại trong
// bảng "Chi tiết" bên dưới, tránh hiện trùng thông tin 2 lần.
export const TARGET_SUMMARY_FIELDS = new Set([
  'targetUserId',
  'targetUserName',
  'targetUserEmail',
  'targetTaskId',
  'targetTaskTitle',
  'targetTaskSubject',
]);

export const formatMetaEntries = (
  meta: Record<string, unknown> = {},
  excludeKeys: Set<string> = new Set(),
): [string, string][] =>
  Object.entries(meta)
    .filter(([key, value]) => {
      if (value === undefined || value === null || value === '') return false;
      return !excludeKeys.has(key);
    })
    .map(([key, value]) => [
      META_FIELD_LABEL[key] || key,
      typeof value === 'object' ? JSON.stringify(value) : String(value),
    ]);

// "Tạo người dùng · Nguyễn Văn A" thay vì chỉ "Tạo người dùng" trơ trọi —
// gộp label hành động với tên đối tượng nếu meta có sẵn (không gọi thêm
// API). Ưu tiên: người dùng bị tác động > đề thực hành > tên trong body gốc
// (VD user.create chưa có "target" vì user vừa tạo, nhưng vẫn có fullName).
export const buildActionSummary = (item: AuditLogItem): string => {
  const label = ACTION_LABEL[item.action] || item.action;
  const target =
    (item.meta?.targetUserName as string) ||
    (item.meta?.targetTaskTitle as string) ||
    (item.meta?.fullName as string);
  return target ? `${label} · ${target}` : label;
};
