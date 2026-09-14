'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Collapse, Empty, Spin, Tag } from 'antd';
import { CaretRightOutlined, LeftOutlined } from '@ant-design/icons';
import { useAppSelector } from '@redux';
import { dashboardQuery } from '~mdDashboard/redux';
import { isTaskAccessible as checkTaskAccessible } from '~mdDashboard/utils/isTaskAccessible';
import PracticeTaskContent from '~mdDashboard/components/PracticeTaskContent';
import BookmarkButton from '@components/BookmarkButton';
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
  // Sidebar liệt kê bài tập của khóa thực hành - trước đây chỉ bài ĐANG MỞ
  // (trong PracticeTaskContent bên trái) mới có nút lưu, các bài còn lại
  // trong danh sách không lưu được nếu chưa bấm vào. Suy trạng thái đã lưu
  // 1 lần cho cả sidebar, đúng pattern LessonDetailPage.
  const { data: bookmarkedTaskIds } =
    dashboardQuery.useGetBookmarkIdsQuery('practiceTask');

  // Tiến độ để biết bài nào đã tới lượt — cùng 2 nguồn mà trang học đang
  // dùng, xem utils/isTaskAccessible.
  const { userProfile } =
    useAppSelector(state => state.authReducer.tokenInfo) || {};
  const isAdmin = userProfile?.role?.level <= 2;
  const { data: videoCompletedBySubLesson } =
    dashboardQuery.useGetMyLessonVideoProgressQuery(
      { userId: userProfile?._id || '', lessonId },
      { skip: !userProfile?._id || !lessonId },
    );
  const { data: quizPassedByLibrary } =
    dashboardQuery.useGetMyLessonQuizProgressQuery(
      { userId: userProfile?._id || '', lessonId },
      { skip: !userProfile?._id || !lessonId },
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

  // Dãy nội dung khóa học theo đúng thứ tự hiển thị (library trộn với bài
  // thực hành theo order) — y hệt ModuleDetailPage.getModuleContentItems,
  // cần để biết mục nào đứng trước mỗi bài thực hành.
  const contentSeq = useMemo(
    () =>
      (lessonDetail?.modules || []).flatMap((m: any) => {
        const libraryItems = (m.libraries || []).map((l: any, i: number) => ({
          kind: 'library' as const,
          data: l,
          order: i,
        }));
        const taskItems = (tasks || [])
          .filter(t => t.moduleId === m._id)
          .map(t => ({ kind: 'task' as const, data: t, order: t.order ?? 0 }));
        return [...libraryItems, ...taskItems].sort(
          (a, b) => a.order - b.order,
        );
      }),
    [lessonDetail, tasks],
  );

  // Trang này trước đây hiện thẳng MỌI bài của khóa và bấm là vào được, nên
  // đi đường này là bỏ qua sạch lộ trình mà trang học đang áp. Backend nay
  // cũng chặn (PracticeTaskService.assertTaskAccessible) — khóa ở đây để
  // người học nhìn thấy trạng thái, thay vì bấm vào rồi ăn lỗi 403.
  const isTaskLocked = (taskIdToCheck: string) =>
    !checkTaskAccessible(
      contentSeq,
      contentSeq.findIndex(
        it => it.kind === 'task' && it.data._id === taskIdToCheck,
      ),
      { isAdmin, videoCompletedBySubLesson, quizPassedByLibrary },
    );

  useEffect(() => {
    if (selectedTaskId || isLoading || !lessonDetail?.modules?.length) return;
    // Mở sẵn bài đầu tiên ĐÃ mở khóa, không phải bài đầu danh sách — nếu
    // không, vào trang là tự chọn ngay một bài chưa tới lượt rồi hiện lỗi.
    const firstUnlocked = (lessonDetail.modules || [])
      .flatMap((m: any) => tasksByModule[m._id] || [])
      .find(t => !isTaskLocked(t._id));
    if (firstUnlocked) setSelectedTaskId(firstUnlocked._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskId, isLoading, lessonDetail, tasksByModule, contentSeq]);

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
              {group.tasks.map(task => {
                const locked = isTaskLocked(task._id);
                return (
                  <div
                    key={task._id}
                    className={
                      'practice-course-task-item' +
                      (task._id === selectedTaskId
                        ? ' practice-course-task-item--active'
                        : '')
                    }
                    style={
                      locked
                        ? { opacity: 0.5, cursor: 'not-allowed' }
                        : undefined
                    }
                    title={
                      locked
                        ? 'Hoàn thành nội dung trước đó trong khóa học để mở bài này'
                        : undefined
                    }
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (locked) return;
                      setSelectedTaskId(task._id);
                    }}>
                    <span>{task.title}</span>
                    <div className="practice-course-task-item-actions">
                      {locked && <Tag>Chưa mở khóa</Tag>}
                      <Tag color={task.subject === 'Excel' ? 'green' : 'blue'}>
                        {task.subject}
                      </Tag>
                      <BookmarkButton
                        itemType="practiceTask"
                        itemId={task._id}
                        bookmarked={(bookmarkedTaskIds || []).includes(
                          task._id,
                        )}
                        size={16}
                      />
                    </div>
                  </div>
                );
              })}
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
