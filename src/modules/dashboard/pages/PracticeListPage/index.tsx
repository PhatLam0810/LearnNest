'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Empty, Spin, Tabs, Tag } from 'antd';
import { dashboardQuery } from '~mdDashboard/redux';
import { PracticeSubject } from '~mdDashboard/types/practice';
import './styles.scss';

const SUBJECT_TABS: {
  key: string;
  label: string;
  subject?: PracticeSubject;
}[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'excel', label: 'Excel', subject: 'Excel' },
  { key: 'word', label: 'Word', subject: 'Word' },
];

const PracticeListPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const subject = SUBJECT_TABS.find(t => t.key === activeTab)?.subject;

  const { data: courses, isFetching: isLoadingCourses } =
    dashboardQuery.useGetPracticeCoursesQuery();
  // Bài tập chưa gắn vào khóa thực hành nào (chưa có lessonId) — vẫn hiện
  // riêng bên dưới để không "mất" đề cũ nếu admin chưa kịp gán khóa/phần.
  const { data: allTasks, isFetching: isLoadingTasks } =
    dashboardQuery.useGetPracticeTasksStudentQuery();

  const filteredCourses = (courses || []).filter(
    c => !subject || c.subject === subject,
  );
  const orphanTasks = (allTasks || []).filter(
    t => !t.lessonId && (!subject || t.subject === subject),
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

      {isLoading ? (
        <Spin />
      ) : filteredCourses.length === 0 && orphanTasks.length === 0 ? (
        <Empty description="Chưa có đề thực hành nào" />
      ) : (
        <>
          {filteredCourses.length > 0 && (
            <div className="practice-task-grid">
              {filteredCourses.map(course => (
                <div
                  key={course.lessonId}
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

          {orphanTasks.length > 0 && (
            <>
              <h2 className="practice-list-subheading-2">Bài tập khác</h2>
              <div className="practice-task-grid">
                {orphanTasks.map(task => (
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
                    <h3 className="practice-task-title">{task.title}</h3>
                    {task.description && (
                      <p className="practice-task-desc">{task.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PracticeListPage;
