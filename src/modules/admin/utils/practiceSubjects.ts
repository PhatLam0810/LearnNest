import { adminQuery } from '~mdAdmin/redux';

// Mục của trang Luyện tập do admin tự thêm/sửa/xóa (PracticeSubjectsModal).
export const usePracticeSubjects = () => {
  const { data } = adminQuery.useGetPracticeSubjectsQuery();
  const options = (data ?? []).map(s => ({ value: s.key, label: s.label }));
  const labelOf = (key?: string) =>
    options.find(o => o.value === key)?.label ?? key ?? '';
  return { options, labelOf };
};
