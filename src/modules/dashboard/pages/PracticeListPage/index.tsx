'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Empty, Input, Select, Spin, Tabs, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { dashboardQuery } from '~mdDashboard/redux';
import { PracticeSubject } from '~mdDashboard/types/practice';
import './styles.scss';

// Chuẩn hóa chuỗi trước khi so khớp tìm kiếm - bỏ dấu tiếng Việt để "bao
// cao" vẫn tìm ra "Báo cáo..." (gõ tiếng Việt không dấu là thói quen phổ
// biến khi tìm kiếm nhanh), lowercase để không phân biệt hoa/thường.
const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();

const SUBJECT_TABS: {
  key: string;
  label: string;
  subject?: PracticeSubject;
}[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'excel', label: 'Excel', subject: 'Excel' },
  { key: 'word', label: 'Word', subject: 'Word' },
];

// Chưa có field độ khó riêng trên PracticeTask — độ khó hiện được ghi ngay
// trong title dạng hậu tố "(Trung bình)"/"(Nâng cao)", đề không có hậu tố
// nào mặc định là mức Dễ. Suy ra từ title thay vì thêm field/migration mới
// chỉ để phục vụ sắp xếp.
type Difficulty = 'Dễ' | 'Trung bình' | 'Nâng cao';
const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Dễ: 0,
  'Trung bình': 1,
  'Nâng cao': 2,
};
const getDifficulty = (title: string): Difficulty => {
  if (/\(Nâng cao\)\s*$/i.test(title)) return 'Nâng cao';
  if (/\(Trung bình\)\s*$/i.test(title)) return 'Trung bình';
  return 'Dễ';
};
const DIFFICULTY_TAG_COLOR: Record<Difficulty, string> = {
  Dễ: 'success',
  'Trung bình': 'gold',
  'Nâng cao': 'red',
};

const SORT_OPTIONS = [
  { value: 'name', label: 'Tên A-Z' },
  { value: 'difficulty', label: 'Độ khó: Dễ → Khó' },
] as const;
type SortKey = (typeof SORT_OPTIONS)[number]['value'];

const PracticeListPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  // 82+ bài tập dồn hết vào 1 danh sách phẳng (xem allTasksFiltered) không
  // có cách nào tìm nhanh 1 bài cụ thể ngoài cuộn tay - ô tìm kiếm lọc ngay
  // trên dữ liệu đã tải sẵn ở client (không gọi API riêng), vì trang này
  // vốn đã tải toàn bộ đề 1 lần.
  const [keyword, setKeyword] = useState('');
  const subject = SUBJECT_TABS.find(t => t.key === activeTab)?.subject;

  const { data: courses, isFetching: isLoadingCourses } =
    dashboardQuery.useGetPracticeCoursesQuery();
  // Bài tập chưa gắn vào khóa thực hành nào (chưa có lessonId) — vẫn hiện
  // riêng bên dưới để không "mất" đề cũ nếu admin chưa kịp gán khóa/phần.
  const { data: allTasks, isFetching: isLoadingTasks } =
    dashboardQuery.useGetPracticeTasksStudentQuery();

  const normalizedKeyword = normalize(keyword.trim());
  const matchesKeyword = (...texts: (string | undefined)[]) =>
    !normalizedKeyword ||
    texts.some(t => t && normalize(t).includes(normalizedKeyword));

  const filteredCourses = (courses || []).filter(
    c => (!subject || c.subject === subject) && matchesKeyword(c.title),
  );
  // Toàn bộ đề (không gom theo khóa) — để học viên tìm nhanh 1 bài cụ thể mà
  // không cần bấm vào từng thẻ khóa trước. Mặc định sắp theo tên cho dễ dò,
  // hoặc theo độ khó Dễ → Khó nếu chọn.
  const allTasksFiltered = [...(allTasks || [])]
    .filter(
      t =>
        (!subject || t.subject === subject) &&
        matchesKeyword(t.title, t.description),
    )
    .sort((a, b) =>
      sortKey === 'difficulty'
        ? DIFFICULTY_ORDER[getDifficulty(a.title)] -
            DIFFICULTY_ORDER[getDifficulty(b.title)] ||
          a.title.localeCompare(b.title)
        : a.title.localeCompare(b.title),
    );

  const isLoading = isLoadingCourses || isLoadingTasks;

  return (
    <div className="practice-list-page">
      <h1 className="practice-list-heading">Thực Hành MOS</h1>
      <p className="practice-list-subheading">
        Luyện tập các bài tập Word/Excel sát với đề thi MOS — nộp bài để hệ
        thống tự động chấm điểm và hướng dẫn sửa lỗi. Bạn có thể nộp lại bao
        nhiêu lần tuỳ ý.
      </p>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={SUBJECT_TABS.map(t => ({ key: t.key, label: t.label }))}
      />

      <Input
        allowClear
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        placeholder="Tìm bài tập theo tên..."
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        style={{ maxWidth: 360, marginBottom: 16 }}
      />

      {isLoading ? (
        <Spin />
      ) : filteredCourses.length === 0 && allTasksFiltered.length === 0 ? (
        <Empty
          description={
            keyword.trim()
              ? `Không tìm thấy bài tập nào khớp "${keyword.trim()}"`
              : 'Chưa có đề thực hành nào'
          }
        />
      ) : (
        <>
          {filteredCourses.length > 0 && (
            <div className="practice-task-grid">
              {filteredCourses.map(course => (
                <div
                  // 1 lesson có thể chứa cả bài Word lẫn Excel (VD: phần
                  // thực hành gộp nhiều môn) — BE trả về 2 dòng riêng cho
                  // cùng 1 lessonId, phải ghép thêm subject mới ra key
                  // duy nhất, tránh trùng key React.
                  key={`${course.lessonId}-${course.subject}`}
                  className="practice-task-card"
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    router.push(`/dashboard/practice/course/${course.lessonId}`)
                  }>
                  <Tag color={course.subject === 'Excel' ? 'green' : 'blue'}>
                    {course.subject}
                  </Tag>
                  <h3 className="practice-task-title">{course.title}</h3>
                  <p className="practice-task-desc">
                    {course.taskCount} bài tập
                  </p>
                </div>
              ))}
            </div>
          )}

          {allTasksFiltered.length > 0 && (
            <>
              <div className="practice-list-toolbar">
                <h2 className="practice-list-subheading-2">
                  Tất cả bài tập ({allTasksFiltered.length})
                </h2>
                <Select
                  value={sortKey}
                  onChange={setSortKey}
                  options={
                    SORT_OPTIONS as unknown as {
                      value: string;
                      label: string;
                    }[]
                  }
                  style={{ width: 200 }}
                />
              </div>
              <div className="practice-task-grid">
                {allTasksFiltered.map(task => {
                  const difficulty = getDifficulty(task.title);
                  return (
                    <div
                      key={task._id}
                      className="practice-task-card"
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        router.push(`/dashboard/practice/${task._id}`)
                      }>
                      <Tag color={task.subject === 'Excel' ? 'green' : 'blue'}>
                        {task.subject}
                      </Tag>
                      <Tag color={DIFFICULTY_TAG_COLOR[difficulty]}>
                        {difficulty}
                      </Tag>
                      {task.hasPassed && <Tag color="success">Đạt</Tag>}
                      <h3 className="practice-task-title">{task.title}</h3>
                      {task.description && (
                        <p className="practice-task-desc">{task.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PracticeListPage;
