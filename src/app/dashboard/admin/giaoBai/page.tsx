'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { DatePicker, Modal, Select, Skeleton } from 'antd';
import type { TableProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { dashboardQuery } from '~mdDashboard/redux';
import { LessonAssignmentItem } from '~mdAdmin/redux/RTKQuery/type';
import { ThemedTable } from '~mdAdmin/components';
import styles from './styles';

const buttonStyle = { width: 'auto', height: 44 } as const;

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
    isError: isAssignmentsError,
    refetch: refetchAssignments,
  } = adminQuery.useGetLessonAssignmentsQuery(lessonId || '', {
    skip: !lessonId,
  });
  const [assignBulk, { isLoading: isAssigning }] =
    adminQuery.useAssignTaskToClassesBulkMutation();
  const [removeAssignment] = adminQuery.useRemoveClassAssignmentMutation();

  const classes = classesRes?.items || [];
  const isFormIncomplete = !classIds.length || !taskId || !dueDate;
  const assignDisabled = isFormIncomplete || isAssigning;

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
        messageApi.warning(
          `Giao thành công ${result.succeeded.length}/${classIds.length} lớp. ${result.failed.length} lớp lỗi: ${result.failed
            .map(f => f.message)
            .join('; ')}`,
        );
      } else {
        messageApi.success(`Đã giao bài cho ${result.succeeded.length} lớp`);
      }
      setClassIds([]);
      setTaskId(undefined);
      setDueDate(null);
      refetchAssignments();
    } catch (err: unknown) {
      messageApi.error(
        (err as { data?: { message?: string } })?.data?.message ||
          'Giao bài thất bại, vui lòng thử lại',
      );
    }
  };

  const handleRemove = (item: LessonAssignmentItem) => {
    Modal.confirm({
      title: 'Xóa bài đã giao?',
      content: `Bài "${item.taskTitle}" sẽ không còn được giao cho lớp ${item.className}. Bài nộp của học viên vẫn được giữ lại. Không thể hoàn tác.`,
      okText: 'Xóa bài giao',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeAssignment({
            classId: item.classId,
            assignmentId: item.assignmentId,
          }).unwrap();
          refetchAssignments();
        } catch {
          messageApi.error('Xóa bài giao thất bại');
        }
      },
    });
  };

  const columns: TableProps<LessonAssignmentItem>['columns'] = [
    {
      title: 'Lớp',
      key: 'className',
      render: (_: unknown, r) => (
        <Text style={styles.cellStrong}>{r.className}</Text>
      ),
    },
    {
      title: 'Đề thực hành',
      key: 'taskTitle',
      render: (_: unknown, r) => (
        <View style={styles.taskCell}>
          <Text style={styles.cellStrong}>{r.taskTitle}</Text>
          <Text
            style={{
              ...styles.subjectTag,
              ...(r.subject === 'Excel'
                ? styles.subjectExcel
                : styles.subjectWord),
            }}>
            {r.subject}
          </Text>
        </View>
      ),
    },
    {
      title: 'Hạn nộp',
      key: 'dueDate',
      render: (_: unknown, r) => dayjs(r.dueDate).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      width: 120,
      render: (_: unknown, r) => (
        <button
          type="button"
          style={styles.deleteButton as React.CSSProperties}
          onClick={() => handleRemove(r)}>
          Xóa
        </button>
      ),
    },
  ];

  const renderAssignments = () => {
    if (isLoadingAssignments && !assignments) {
      return (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2].map(k => (
            <Skeleton.Input key={k} active block style={{ height: 40 }} />
          ))}
        </View>
      );
    }
    if (isAssignmentsError) {
      return (
        <View style={{ ...styles.stateWrap, ...styles.errorWrap }}>
          <Text style={styles.errorText}>
            Không tải được danh sách bài đã giao.
          </Text>
          <AppButton style={buttonStyle} onClick={() => refetchAssignments()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!assignments?.length) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>
            Chưa giao bài nào cho khóa này. Chọn lớp, đề và hạn nộp ở trên để
            giao bài đầu tiên.
          </Text>
        </View>
      );
    }
    return (
      <ThemedTable
        rowKey="assignmentId"
        columns={columns}
        dataSource={assignments}
        pagination={false}
      />
    );
  };

  return (
    <View style={styles.page}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Giao bài</Text>
        <Text style={styles.subtitle}>
          Giao đề thực hành kèm hạn nộp cho 1 hoặc nhiều lớp thuộc cùng 1 khóa
          học. Học viên xem ở mục &quot;Bài được giao&quot;.
        </Text>
      </View>

      <View style={styles.lessonField}>
        <Text style={styles.label}>Khóa học</Text>
        <Select
          size="large"
          aria-label="Khóa học"
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
      </View>

      {!lessonId ? (
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>
            Chọn khóa học để bắt đầu giao bài.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.label}>Lớp thực hành</Text>
              <Select
                mode="multiple"
                size="large"
                aria-label="Lớp thực hành"
                placeholder="Chọn 1 hoặc nhiều lớp"
                loading={isLoadingClasses}
                value={classIds}
                onChange={setClassIds}
                options={classes.map(c => ({
                  value: c._id,
                  label: c.practiceClassName || c.className || c._id,
                }))}
                notFoundContent="Khóa này chưa có lớp thực hành nào. Tạo lớp ở tab Lớp Thực Hành."
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Đề thực hành</Text>
              <Select
                size="large"
                aria-label="Đề thực hành"
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
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Hạn nộp</Text>
              <DatePicker
                size="large"
                aria-label="Hạn nộp"
                style={{ width: '100%' }}
                placeholder="Chọn ngày giờ"
                value={dueDate}
                onChange={setDueDate}
                format="DD/MM/YYYY HH:mm"
                showTime={{ format: 'HH:mm' }}
              />
            </View>
            <AppButton
              type="primary"
              style={{
                ...buttonStyle,
                ...(isFormIncomplete ? styles.assignDisabled : null),
              }}
              loading={isAssigning}
              disabled={assignDisabled}
              onClick={handleAssign}>
              Giao bài
            </AppButton>
          </View>

          <View style={styles.section}>
            <Text style={styles.listHeading}>
              {`Bài đã giao (${assignments?.length ?? 0})`}
            </Text>
            {renderAssignments()}
          </View>
        </>
      )}
    </View>
  );
};

export default GiaoBaiPage;
