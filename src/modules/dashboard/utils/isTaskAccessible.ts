// Bài thực hành ở vị trí idx trong seq (danh sách nội dung video + bài thực
// hành đã trộn theo đúng thứ tự hiển thị) có được phép làm/xem chưa.
// - Admin (role.level <= 2) luôn qua — dùng để kiểm tra/soạn đề, không đi
//   học theo tiến độ như học viên thật. Đây LÀ DÒNG QUAN TRỌNG NHẤT của cả
//   hàm: thiếu dòng này, admin sẽ bị khoá y hệt học viên thật mỗi khi thêm
//   1 chiều gating mới — lỗi thật đã xảy ra khi thêm gating quiz→task, admin
//   report "vô xem bài thực hành không được" (xem test bên dưới).
// - Mục đầu tiên trong toàn bộ nội dung: luôn qua (không có gì đứng trước).
// - Mục trước là bài thực hành: dựa thẳng vào hasPassed (đạt >= 80%).
// - Mục trước là trắc nghiệm (Library type Text): dựa vào ResultTest.isPass
//   (đạt >= 2/3 số câu, lấy qua getMyLessonQuizProgress).
// - Mục trước là video: dựa vào VideoTracking.completed (đã xem >= 95%, lấy
//   qua getMyLessonVideoProgress) — KHÔNG dùng usersCanPlay, vì đó chỉ là
//   "đã tới lượt xem" (mở khoá), không xác nhận đã xem hết.
//
// Dùng CHUNG cho cả ModuleDetailPage lẫn LessonDetailPage — trước đây 2 nơi
// tự định nghĩa 2 bản gần giống hệt nhau, dễ sửa 1 nơi mà quên nơi kia
// (đúng là điều đã xảy ra: thêm bypass admin ở ModuleDetailPage trước, mãi
// mới nhớ ra LessonDetailPage cũng thiếu y hệt).
export type TaskAccessibilitySeqItem = {
  kind: 'library' | 'task';
  data: any;
};

export type TaskAccessibilityContext = {
  isAdmin: boolean;
  videoCompletedBySubLesson?: Record<string, boolean>;
  quizPassedByLibrary?: Record<string, boolean>;
};

export function isTaskAccessible(
  seq: TaskAccessibilitySeqItem[],
  idx: number,
  ctx: TaskAccessibilityContext,
): boolean {
  if (ctx.isAdmin) return true;
  if (idx <= 0) return true;
  const prev = seq[idx - 1];
  if (prev.kind === 'task') return !!prev.data.hasPassed;
  if (prev.data.type === 'Text') {
    return !!ctx.quizPassedByLibrary?.[prev.data._id];
  }
  return !!ctx.videoCompletedBySubLesson?.[prev.data._id];
}
