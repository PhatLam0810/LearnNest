'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Collapse, Empty, Spin, Tag } from 'antd';
import { CaretRightOutlined, LeftOutlined } from '@ant-design/icons';
import { dashboardQuery } from '~mdDashboard/redux';
import PracticeTaskContent from '~mdDashboard/components/PracticeTaskContent';
import { PracticeTask } from '~mdDashboard/types/practice';
import './styles.scss';

type Props = { lessonId: string };

// Trang "làm bài" của 1 khóa thực hành: sidebar bên phải liệt kê Phần >
// Bài tập (y hệt trang moduleDetail của khóa học video), bấm bài nào thì
// nội dung + nộp bài của bài đó hiện bên trái.
const PracticeCourseDetailPage: React.FC<Props> = ({ lessonId }) => {
  const router = useRouter();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: lessonDetail, isLoading: isLoadingLesson } =
    dashboardQuery.useGetLessonIdQuery({ id: lessonId }, { skip: !lessonId });
  const { data: tasks, isFetching: isLoadingTasks } =
    dashboardQuery.useGetPracticeTasksStudentQuery(
      { lessonId },
      { skip: !lessonId },
    );

  const tasksByModule = useMemo(() => {
    const map: Record<string, PracticeTask[]> = {};
    (tasks || []).forEach(task => {
      const key = task.moduleId || 'unassigned';
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  const isLoading = isLoadingLesson || isLoadingTasks;

  useEffect(() => {
    if (selectedTaskId || isLoading || !lessonDetail?.modules?.length) return;
    const firstModuleWithTasks = lessonDetail.modules.find(
      m => (tasksByModule[m._id] || []).length > 0,
    );
    const firstTask = firstModuleWithTasks
      ? tasksByModule[firstModuleWithTasks._id][0]
      : null;
    if (firstTask) setSelectedTaskId(firstTask._id);
  }, [selectedTaskId, isLoading, lessonDetail, tasksByModule]);

  if (isLoading) {
    return (
      <div className="practice-course-page practice-course-loading">
        <Spin />
      </div>
    );
  }

  if (!lessonDetail) {
    return (
      <div className="practice-course-page">
        <Empty description="Không tìm thấy khóa thực hành" />
      </div>
    );
  }

  const modulesWithTasks = (lessonDetail.modules || []).filter(
    m => (tasksByModule[m._id] || []).length > 0,
  );

  // 1 module có thể chứa cả bài Word lẫn Excel (VD gán nhầm/gộp lúc soạn
  // đề) — tách hẳn thành 2 nhóm con Word/Excel trong danh sách thay vì để
  // lẫn lộn 1 danh sách, cho rõ bài nào thuộc môn nào.
  const collapseItems = modulesWithTasks.map((module, index) => {
    const moduleTasks = tasksByModule[module._id];
    const wordTasks = moduleTasks.filter(t => t.subject === 'Word');
    const excelTasks = moduleTasks.filter(t => t.subject === 'Excel');
    const groups: { subject: 'Word' | 'Excel'; tasks: PracticeTask[] }[] = [
      ...(wordTasks.length
        ? [{ subject: 'Word' as const, tasks: wordTasks }]
        : []),
      ...(excelTasks.length
        ? [{ subject: 'Excel' as const, tasks: excelTasks }]
        : []),
    ];
    const showGroupLabel = groups.length > 1;

    return {
      key: String(index),
      label: (
        <div className="practice-course-module-header">
          <span className="practice-course-module-title">{module.title}</span>
          <span className="practice-course-module-count">
            {moduleTasks.length} bài tập
          </span>
        </div>
      ),
      children: (
        <div className="practice-course-task-groups">
          {groups.map(group => (
            <div className="practice-course-task-list" key={group.subject}>
              {showGroupLabel && (
                <div className="practice-course-subject-label">
                  {group.subject}
                </div>
              )}
              {group.tasks.map(task => (
                <div
                  key={task._id}
                  className={
                    'practice-course-task-item' +
                    (task._id === selectedTaskId
                      ? ' practice-course-task-item--active'
                      : '')
                  }
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTaskId(task._id)}>
                  <span>{task.title}</span>
                  <Tag color={task.subject === 'Excel' ? 'green' : 'blue'}>
                    {task.subject}
                  </Tag>
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
    };
  });

  return (
    <div className="practice-course-page">
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={() => router.push('/dashboard/practice')}>
        Quay lại
      </Button>

      <div className="practice-course-header">
        <h1>{lessonDetail.title}</h1>
      </div>

      <div className="practice-course-layout">
        <div className="practice-course-main">
          {selectedTaskId ? (
            <PracticeTaskContent taskId={selectedTaskId} />
          ) : (
            <Empty description="Khóa thực hành này chưa có bài tập nào" />
          )}
        </div>
        <div className="practice-course-side">
          <div className="practice-course-side-title">Nội dung khóa học</div>
          <Collapse
            bordered={false}
            defaultActiveKey={['0']}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            items={collapseItems}
          />
        </div>
      </div>
    </div>
  );
};

export default PracticeCourseDetailPage;
