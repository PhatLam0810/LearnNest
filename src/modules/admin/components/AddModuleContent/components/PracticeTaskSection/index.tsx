import React, { useState } from 'react';
import { Button, Checkbox, Empty, Spin, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppPagination } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import CreateTaskInlineForm from './CreateTaskInlineForm';

type LessonMatch = { _id: string; title: string };

type Props = {
  // undefined khi phần học chưa được lưu lần nào (chưa có _id thật) — lúc
  // đó chưa biết gán bài thực hành vào đâu nên chưa hiện phần này.
  moduleId?: string;
};

// Cho phép admin gắn các bài thực hành (Word/Excel) đã tạo sẵn ở tab
// "Thực Hành MOS" vào phần học này — song song với phần chọn video/bài học
// (Sắp xếp) ở trên. Không thêm field mới vào Module — dùng đúng
// PracticeTask.moduleId đã có, chỉ bật/tắt qua PUT .../module.
const PracticeTaskSection: React.FC<Props> = ({ moduleId }) => {
  // Module không tự biết nó thuộc Lesson nào (quan hệ thật nằm ở
  // Lesson.modules[]) — tra ngược bằng filter Mongo khớp phần tử mảng.
  const { listItem: lessonMatches, isLoading: isLoadingLesson } =
    useAppPagination<LessonMatch>({
      apiUrl: 'lesson/getAllLesson',
      params: { filter: { modules: moduleId }, pageSize: 1 },
      isLazy: !moduleId,
    });
  const lessonId = lessonMatches[0]?._id;

  const {
    data: tasks,
    isFetching: isLoadingTasks,
    refetch: refetchTasks,
  } = adminQuery.useGetPracticeTasksAdminQuery(
    { lessonId },
    { skip: !lessonId },
  );
  const [setTaskModule] = adminQuery.useSetPracticeTaskModuleMutation();
  const [isCreating, setIsCreating] = useState(false);

  if (!moduleId) {
    return (
      <div style={{ marginTop: 16 }}>
        <Typography.Title level={5}>Bài thực hành</Typography.Title>
        <Typography.Text type="secondary">
          Lưu phần học này trước, sau đó quay lại đây để gắn bài thực hành đã
          tạo ở tab &quot;Thực Hành MOS&quot;.
        </Typography.Text>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Bài thực hành
        </Typography.Title>
        {lessonId && !isCreating && (
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setIsCreating(true)}>
            Tạo bài thực hành mới
          </Button>
        )}
      </div>
      {isLoadingLesson ? (
        <Spin size="small" />
      ) : !lessonId ? (
        <Typography.Text type="secondary">
          Phần học này chưa thuộc khóa học nào — lưu khóa học có chứa phần này
          trước (mục Sắp xếp Phần học), rồi quay lại đây.
        </Typography.Text>
      ) : (
        <>
          {isCreating && (
            <div style={{ marginTop: 12 }}>
              <CreateTaskInlineForm
                lessonId={lessonId}
                moduleId={moduleId}
                onCancel={() => setIsCreating(false)}
                onCreated={() => {
                  setIsCreating(false);
                  refetchTasks();
                }}
              />
            </div>
          )}
          {isLoadingTasks ? (
            <Spin size="small" />
          ) : !tasks || tasks.length === 0 ? (
            !isCreating && (
              <Empty
                description="Khóa học này chưa có bài thực hành nào."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tasks.map(task => (
                <div
                  key={task._id}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Checkbox
                    checked={task.moduleId === moduleId}
                    onChange={e => {
                      setTaskModule({
                        taskId: task._id,
                        moduleId: e.target.checked ? moduleId : null,
                      }).then(() => refetchTasks());
                    }}
                  />
                  <Tag color={task.subject === 'Excel' ? 'green' : 'blue'}>
                    {task.subject}
                  </Tag>
                  <span>{task.title}</span>
                  {!task.isPublished && <Tag color="default">Nháp</Tag>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PracticeTaskSection;
