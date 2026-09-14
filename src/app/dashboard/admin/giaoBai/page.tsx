'use client';
import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  Empty,
  message,
  Select,
  Spin,
  Table,
  Tag,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { adminQuery } from '~mdAdmin/redux';
import { dashboardQuery } from '~mdDashboard/redux';
import { LessonAssignmentItem } from '~mdAdmin/redux/RTKQuery/type';
import './styles.scss';

// Trang giao bài thực hành cho lớp - tách riêng khỏi modal "Tổng Quan Người
// Học" (chọn lớp -> mở modal -> cuộn xuống mới thấy) vì quá khó tìm. Luồng:
// chọn khóa học -> chọn 1 hoặc nhiều lớp thuộc khóa đó -> chọn đề -> hạn nộp.
const GiaoBaiPage: React.FC = () => {
  const [lessonId, setLessonId] = useState<string | undefined>();
  const [classIds, setClassIds] = useState<string[]>([]);
  const [taskId, setTaskId] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);

  const { data: courses, isFetching: isLoadingCourses } =
    dashboardQuery.useGetPracticeCoursesQuery();
  const { data: classesRes, isFetching: isLoadingClasses } =
    adminQuery.useGetPracticeClassesQuery(
      { lessonId: lessonId || '', pageSize: 100 },
      { skip: !lessonId },
    );
  const { data: tasks, isFetching: isLoadingTasks } =
    dashboardQuery.useGetPracticeTasksStudentQuery(
      { lessonId },
      { skip: !lessonId },
    );
  const {
    data: assignments,
    isFetching: isLoadingAssignments,
    refetch: refetchAssignments,
  } = adminQuery.useGetLessonAssignmentsQuery(lessonId || '', {
    skip: !lessonId,
  });
  const [assignBulk, { isLoading: isAssigning }] =
    adminQuery.useAssignTaskToClassesBulkMutation();
  const [removeAssignment] = adminQuery.useRemoveClassAssignmentMutation();

  const classes = classesRes?.items || [];

  const handleChangeLesson = (value: string) => {
    setLessonId(value);
    setClassIds([]);
    setTaskId(undefined);
    setDueDate(null);
  };

  const handleAssign = async () => {
    if (!classIds.length || !taskId || !dueDate) return;
    try {
      const result = await assignBulk({
        classIds,
        taskId,
        dueDate: dueDate.toISOString(),
      }).unwrap();
      if (result.failed.length) {
        message.warning(
          `Giao thành công ${result.succeeded.length}/${classIds.length} lớp. ${result.failed.length} lớp lỗi: ${result.failed
            .map(f => f.message)
            .join('; ')}`,
        );
      } else {
        message.success(`Đã giao bài cho ${result.succeeded.length} lớp`);
      }
      setClassIds([]);
      setTaskId(undefined);
      setDueDate(null);
      refetchAssignments();
    } catch (err: any) {
      message.error(
        err?.data?.message || 'Giao bài thất bại, vui lòng thử lại',
      );
    }
  };

  const handleRemove = async (item: LessonAssignmentItem) => {
    try {
      await removeAssignment({
        classId: item.classId,
        assignmentId: item.assignmentId,
      }).unwrap();
      refetchAssignments();
    } catch {
      message.error('Xóa bài giao thất bại');
    }
  };

  const columns: ColumnsType<LessonAssignmentItem> = [
    { title: 'Lớp', dataIndex: 'className', key: 'className' },
    {
      title: 'Đề thực hành',
      dataIndex: 'taskTitle',
      key: 'taskTitle',
      render: (v, r) => (
        <>
          {v}{' '}
          <Tag color={r.subject === 'Excel' ? 'green' : 'blue'}>
            {r.subject}
          </Tag>
        </>
      ),
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_, r) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(r)}
        />
      ),
    },
  ];

  return (
    <div className="giao-bai-page">
      <h1 className="giao-bai-heading">Giao Bài</h1>
      <p className="giao-bai-sub">
        Giao đề thực hành kèm hạn nộp cho 1 hoặc nhiều lớp thuộc cùng 1 khóa
        học. Học viên xem ở mục &quot;Bài được giao&quot;.
      </p>

      <Select
        className="giao-bai-lesson-select"
        placeholder="Chọn khóa học"
        loading={isLoadingCourses}
        value={lessonId}
        onChange={handleChangeLesson}
        showSearch
        optionFilterProp="label"
        options={(courses || []).map(c => ({
          value: c.lessonId,
          label: `${c.title} (${c.subject} · ${c.taskCount} đề)`,
        }))}
      />

      {!lessonId ? (
        <Empty
          className="giao-bai-empty"
          description="Chọn khóa học để bắt đầu giao bài"
        />
      ) : (
        <>
          <div className="giao-bai-form">
            <Select
              mode="multiple"
              className="giao-bai-form__classes"
              placeholder="Chọn 1 hoặc nhiều lớp"
              loading={isLoadingClasses}
              value={classIds}
              onChange={setClassIds}
              options={classes.map(c => ({
                value: c._id,
                label: c.practiceClassName || c.className || c._id,
              }))}
              notFoundContent={
                isLoadingClasses ? (
                  <Spin size="small" />
                ) : (
                  <Empty
                    description="Khóa này chưa có lớp thực hành nào — tạo ở tab Tổng Quan Người Học"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )
              }
            />
            <Select
              className="giao-bai-form__task"
              placeholder="Chọn đề thực hành"
              loading={isLoadingTasks}
              value={taskId}
              onChange={setTaskId}
              showSearch
              optionFilterProp="label"
              options={(tasks || []).map(t => ({
                value: t._id,
                label: `${t.title} (${t.subject})`,
              }))}
            />
            <DatePicker
              placeholder="Hạn nộp"
              value={dueDate}
              onChange={setDueDate}
              format="DD/MM/YYYY HH:mm"
              showTime={{ format: 'HH:mm' }}
            />
            <Button
              type="primary"
              loading={isAssigning}
              disabled={!classIds.length || !taskId || !dueDate}
              onClick={handleAssign}>
              Giao bài
            </Button>
          </div>

          <div className="giao-bai-list-heading">
            Bài đã giao ({assignments?.length ?? 0})
          </div>
          <Table
            className="giao-bai-table"
            rowKey="assignmentId"
            columns={columns}
            dataSource={assignments || []}
            loading={isLoadingAssignments}
            pagination={false}
            locale={{ emptyText: 'Chưa giao bài nào cho khóa này' }}
          />
        </>
      )}
    </div>
  );
};

export default GiaoBaiPage;
