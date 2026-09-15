import { QuestionItem } from '~mdAdmin/services/api/type';

const OVERDUE_MS = 24 * 60 * 60 * 1000;

// Màu trạng thái câu hỏi dùng chung cho danh sách + panel chi tiết - đúng
// bảng màu spec: Chờ trả lời (#b45309/#fef3e2), Quá hạn (#dc2626/#fdecec),
// Đã trả lời (#16a34a/#e9f9ef), Đã bỏ qua (#6b7280/#f1f3f7).
export const questionState = (
  item: Pick<QuestionItem, 'isAnswered' | 'dismissedAt' | 'createdAt'>,
) => {
  if (item.isAnswered) {
    return { label: 'Đã trả lời', color: '#16a34a', bg: '#e9f9ef' };
  }
  if (item.dismissedAt) {
    return { label: 'Đã bỏ qua', color: '#6b7280', bg: '#f1f3f7' };
  }
  const overdue = Date.now() - new Date(item.createdAt).getTime() > OVERDUE_MS;
  return overdue
    ? { label: 'Quá hạn', color: '#dc2626', bg: '#fdecec' }
    : { label: 'Chờ trả lời', color: '#b45309', bg: '#fef3e2' };
};
