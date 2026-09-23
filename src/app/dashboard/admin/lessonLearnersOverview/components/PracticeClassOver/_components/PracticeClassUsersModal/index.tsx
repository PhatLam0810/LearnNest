import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Empty,
  message,
  Modal,
  Select,
  Table,
  Tag,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import styles from './styles';
import { useAppPagination } from '@hooks/pagination';
import { adminQuery } from '~mdAdmin/redux';
import { ClassGradeStudent } from '~mdAdmin/redux/RTKQuery/type';
import { dashboardQuery } from '~mdDashboard/redux';
import AddClassMembersModal from '../AddClassMembersModal';

type PracticeClassUserItem = {
  userId: string;
  fullName: string;
  email: string;
  status?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  selectedPracticeClassId: string;
  // Cần để lọc danh sách đề thực hành cho picker "Giao bài" — chỉ hiện đề
  // thuộc đúng khóa học của lớp này (BE cũng chặn giao nhầm đề ở
  // AdminService.assignTaskToClass, đây là gợi ý trước cho admin).
  selectedLessonId?: string;
  onExport: (practiceUsers: PracticeClassUserItem[]) => void;
};

const PracticeClassUsersModal: React.FC<Props> = ({
  open,
  onClose,
  selectedPracticeClassId,
  selectedLessonId,
  onExport,
}) => {
  const { listItem, currentData, fetchData, refresh, search } =
    useAppPagination<PracticeClassUserItem>({
      apiUrl: `admin/practice-classes/${selectedPracticeClassId}/users`,
    });
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);

  useEffect(() => {
    if (open && selectedPracticeClassId) {
      fetchData();
      refresh();
    }
  }, [open, selectedPracticeClassId]);

  // ---- Giao bài (ClassAssignment) ----
  const { data: assignments, refetch: refetchAssignments } =
    adminQuery.useGetClassAssignmentsQuery(selectedPracticeClassId, {
      skip: !open || !selectedPracticeClassId,
    });
  const { data: lessonTasks } = dashboardQuery.useGetPracticeTasksStudentQuery(
    { lessonId: selectedLessonId },
    { skip: !open || !selectedLessonId },
  );
  const [assignTask, { isLoading: isAssigning }] =
    adminQuery.useAssignTaskToClassMutation();
  const [removeAssignment] = adminQuery.useRemoveClassAssignmentMutation();
  const [exportGrades, { isLoading: isExportingGrades }] =
    adminQuery.useExportClassGradesMutation();
  const {
    data: grades,
    isFetching: isLoadingGrades,
    isError: isGradesError,
  } = adminQuery.useGetClassGradesQuery(selectedPracticeClassId, {
    skip: !open || !selectedPracticeClassId,
  });

  const [pickTaskId, setPickTaskId] = useState<string | undefined>();
  const [pickDueDate, setPickDueDate] = useState<Dayjs | null>(null);

  const handleAssign = async () => {
    if (!pickTaskId || !pickDueDate) return;
    try {
      await assignTask({
        classId: selectedPracticeClassId,
        body: { taskId: pickTaskId, dueDate: pickDueDate.toISOString() },
      }).unwrap();
      message.success('Đã giao bài cho lớp');
      setPickTaskId(undefined);
      setPickDueDate(null);
      refetchAssignments();
    } catch {
      message.error('Giao bài thất bại, vui lòng thử lại');
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      await removeAssignment({
        classId: selectedPracticeClassId,
        assignmentId,
      }).unwrap();
      refetchAssignments();
    } catch {
      message.error('Xóa bài giao thất bại');
    }
  };

  const handleExportGrades = async () => {
    try {
      const blob = await exportGrades({
        classId: selectedPracticeClassId,
      }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `grades-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      message.error('Xuất điểm thất bại, vui lòng thử lại');
    }
  };

  // Ngưỡng màu giống hệt trang "Tổng Quan" của học viên (my-courses/page.tsx
  // scoreStyle) để cùng 1 điểm số luôn hiện cùng 1 màu ở mọi nơi trong app.
  const gradeScoreStyle = (score: number) => {
    if (score >= 8) return styles.gradeScoreGood;
    if (score >= 5) return styles.gradeScoreOk;
    return styles.gradeScoreBad;
  };

  const gradeColumns: ColumnsType<ClassGradeStudent> = [
    {
      title: 'Học viên',
      key: 'student',
      fixed: 'left',
      width: 200,
      render: (_: unknown, r) => (
        <div>
          <div>{r.fullName || r.email}</div>
          <div style={styles.modalSummaryText}>{r.studentId}</div>
        </div>
      ),
    },
    ...(grades?.assignments ?? []).map(
      (a, i): ColumnsType<ClassGradeStudent>[number] => ({
        title: (
          <>
            <div>{a.title}</div>
            {a.subject && (
              <Tag color={a.subject === 'Excel' ? 'green' : 'blue'}>
                {a.subject}
              </Tag>
            )}
          </>
        ),
        key: a.assignmentId,
        align: 'right',
        width: 140,
        render: (_: unknown, r) => {
          const score = r.scores[i];
          return score == null ? (
            <span style={styles.gradeScoreEmpty}>-</span>
          ) : (
            <span style={gradeScoreStyle(score)}>{score}</span>
          );
        },
      }),
    ),
    {
      title: 'Điểm TB',
      key: 'avg',
      align: 'right',
      fixed: 'right',
      width: 100,
      render: (_: unknown, r) =>
        r.avg == null ? (
          <span style={styles.gradeScoreEmpty}>-</span>
        ) : (
          <span style={{ ...styles.gradeAvg, ...gradeScoreStyle(r.avg) }}>
            {r.avg}
          </span>
        ),
    },
    {
      title: 'Đã nộp',
      key: 'submitted',
      align: 'right',
      fixed: 'right',
      width: 90,
      render: (_: unknown, r) =>
        `${r.submittedCount}/${grades?.assignments.length ?? 0}`,
    },
  ];

  const learnerColumns: ColumnsType<PracticeClassUserItem> = [
    {
      title: 'Tên Người Dùng',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '15%',
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'studentId',
      key: 'studentId',
      width: '15%',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
      width: '15%',
    },
    {
      title: 'Khoa',
      dataIndex: 'faculty',
      key: 'faculty',
      width: '15%',
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Danh Sách Người Trong Lớp Thực Hành"
      width={'80%'}
      footer={null}>
      <div style={styles.modalContentWrap}>
        <div style={styles.modalToolbar}>
          <div style={styles.modalSummaryText}>
            Tổng số: {currentData?.totalRecords}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              key="addMembers"
              type="primary"
              disabled={!selectedLessonId}
              onClick={() => setIsAddMembersOpen(true)}>
              Thêm học viên
            </Button>
            <Button
              key="exportGrades"
              onClick={handleExportGrades}
              loading={isExportingGrades}>
              Xuất Điểm CSV
            </Button>
            <Button
              key="export"
              type="primary"
              onClick={() => onExport(listItem)}>
              Tải Excel
            </Button>
          </div>
        </div>
        <Table
          columns={learnerColumns}
          dataSource={listItem}
          rowKey="userId"
          onChange={res => {
            fetchData({ pageNum: res.current, replace: true });
          }}
          pagination={{
            current: currentData?.pageNum,
            total: currentData?.totalRecords,
            pageSize: currentData?.pageSize,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
          locale={{ emptyText: 'Không có người dùng' }}
        />

        <div style={styles.assignSection}>
          <div style={styles.sectionTitle}>Bài được giao</div>
          <div style={styles.sectionSubtitle}>
            Giao đề thực hành kèm hạn nộp cho cả lớp — học viên xem ở mục
            &quot;Bài được giao&quot;.
          </div>
          <div style={{ ...styles.assignForm, marginTop: 12 }}>
            <Select
              style={{ minWidth: 280 }}
              placeholder="Chọn đề thực hành"
              value={pickTaskId}
              onChange={setPickTaskId}
              showSearch
              optionFilterProp="label"
              options={(lessonTasks || []).map(t => ({
                value: t._id,
                label: `${t.title} (${t.subject})`,
              }))}
              disabled={!selectedLessonId}
            />
            <DatePicker
              placeholder="Hạn nộp"
              value={pickDueDate}
              onChange={setPickDueDate}
              format="DD/MM/YYYY HH:mm"
              showTime={{ format: 'HH:mm' }}
              popupClassName="picker-fit-mobile"
            />
            <Button
              type="primary"
              onClick={handleAssign}
              loading={isAssigning}
              disabled={!pickTaskId || !pickDueDate}>
              Giao bài
            </Button>
          </div>

          {!assignments?.length ? (
            <Empty description="Chưa giao bài nào" />
          ) : (
            assignments.map(a => (
              <div key={a._id} style={styles.assignRow}>
                <div>
                  <strong>{a.taskId.title}</strong>{' '}
                  <Tag color={a.taskId.subject === 'Excel' ? 'green' : 'blue'}>
                    {a.taskId.subject}
                  </Tag>
                  <div style={styles.modalSummaryText}>
                    Hạn nộp: {dayjs(a.dueDate).format('DD/MM/YYYY HH:mm')}
                  </div>
                </div>
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveAssignment(a._id)}
                />
              </div>
            ))
          )}
        </div>

        <div style={styles.assignSection}>
          <div style={styles.sectionTitle}>Bảng điểm</div>
          <div style={styles.sectionSubtitle}>
            Điểm cao nhất mỗi bài (thang 10) — trước đây chỉ xem được qua file
            CSV, nay xem trực tiếp tại đây; nút &quot;Xuất Điểm CSV&quot; ở trên
            vẫn dùng được để lưu file.
          </div>
          {!grades?.assignments.length ? (
            <div style={styles.gradesEmpty}>
              {isLoadingGrades
                ? 'Đang tải bảng điểm...'
                : isGradesError
                  ? 'Không tải được bảng điểm, vui lòng thử lại.'
                  : 'Lớp chưa có bài giao nào để xem điểm — giao bài ở mục "Bài được giao" phía trên trước.'}
            </div>
          ) : (
            <Table
              style={{ marginTop: 12 }}
              size="small"
              loading={isLoadingGrades}
              rowKey="userId"
              dataSource={grades.students}
              pagination={false}
              scroll={{ x: 'max-content' }}
              columns={gradeColumns}
              locale={{ emptyText: 'Lớp chưa có học viên nào' }}
            />
          )}
          {!!grades?.assignments.length && (
            <div style={styles.gradesLegend}>
              Dấu &quot;-&quot; = chưa nộp bài
            </div>
          )}
        </div>
      </div>

      <AddClassMembersModal
        open={isAddMembersOpen}
        onClose={() => setIsAddMembersOpen(false)}
        classId={selectedPracticeClassId}
        lessonId={selectedLessonId}
        onAdded={refresh}
      />
    </Modal>
  );
};

export default PracticeClassUsersModal;
