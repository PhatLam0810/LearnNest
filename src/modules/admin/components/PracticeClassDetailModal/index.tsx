'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Select, Skeleton, Table } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import UserAvatar from '@components/UserAvatar';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { ClassRosterLearner } from '../../redux/RTKQuery/type';
import StateTag from '../StateTag';
import { LEARNER_STATE } from '../practiceClassShared';
import styles from './styles';

interface PracticeClassDetailModalProps {
  classId?: string;
  onClose: () => void;
}

const buttonStyle = { width: 'auto', height: 40 } as const;

const PracticeClassDetailModal: React.FC<PracticeClassDetailModalProps> = ({
  classId,
  onClose,
}) => {
  const [assignmentId, setAssignmentId] = useState<string | undefined>();
  const { data, isFetching, isError, refetch } =
    adminQuery.useGetPracticeClassRosterQuery(
      { classId: classId ?? '', assignmentId },
      { skip: !classId },
    );
  const [remind, { isLoading: isReminding }] =
    adminQuery.useRemindClassAssignmentMutation();

  const close = () => {
    setAssignmentId(undefined);
    onClose();
  };

  const notSubmitted =
    data?.learners.filter(l => l.state === 'not_submitted').length ?? 0;
  const total = data?.learners.length ?? 0;
  const assignment = data?.assignment;

  const handleRemind = () => {
    if (!classId || !assignment) return;
    Modal.confirm({
      title: 'Nhắc hàng loạt?',
      content: `Gửi email và thông báo trong ứng dụng tới ${notSubmitted} học viên chưa nộp bài "${assignment.taskTitle}". Không thể thu hồi sau khi gửi.`,
      okText: 'Gửi nhắc',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const r = await remind({
            classId,
            assignmentId: assignment.id,
          }).unwrap();
          messageApi.success(`Đã nhắc ${r.reminded} học viên`);
        } catch (e: unknown) {
          messageApi.error(
            (e as { data?: { message?: string } })?.data?.message ||
              'Gửi nhắc thất bại',
          );
        }
      },
    });
  };

  const columns: TableProps<ClassRosterLearner>['columns'] = [
    {
      title: 'Học viên',
      key: 'learner',
      render: (_: unknown, r: ClassRosterLearner) => (
        <View style={styles.learnerCell}>
          <UserAvatar
            size={32}
            avatar={r.user.avatar}
            fullName={r.user.fullName}
            seed={r.user._id}
          />
          <View>
            <Text style={styles.learnerName}>
              {r.user.fullName || r.user.email || 'Học viên'}
            </Text>
            <Text style={styles.caption}>{r.user.studentId || ''}</Text>
          </View>
        </View>
      ),
    },
    {
      title: 'Trạng thái nộp',
      key: 'state',
      width: 190,
      render: (_: unknown, r: ClassRosterLearner) => {
        const s = LEARNER_STATE[r.state];
        return (
          <StateTag
            label={
              r.maxScore !== null
                ? `${s.label} · ${r.totalScore}/${r.maxScore}`
                : s.label
            }
            color={s.color}
            bg={s.bg}
          />
        );
      },
    },
    {
      title: 'Nộp lúc',
      key: 'submittedAt',
      width: 150,
      render: (_: unknown, r: ClassRosterLearner) =>
        r.submittedAt ? dayjs(r.submittedAt).format('HH:mm DD/MM/YYYY') : '—',
    },
  ];

  const renderBody = () => {
    if (isFetching && !data) {
      return <Skeleton active paragraph={{ rows: 6 }} />;
    }
    if (isError || !data) {
      return (
        <View style={{ ...styles.centerState, ...styles.errorState }}>
          <Text style={styles.errorText}>Không tải được chi tiết lớp.</Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    return (
      <>
        <View style={styles.infoRow}>
          {data.assignments.length > 1 ? (
            <Select
              size="large"
              aria-label="Chọn bài giao"
              style={{ minWidth: 280 }}
              value={assignment?.id}
              onChange={setAssignmentId}
              options={data.assignments.map(a => ({
                value: a.id,
                label: `${a.taskTitle} · hạn ${dayjs(a.dueDate).format('DD/MM/YYYY HH:mm')}`,
              }))}
            />
          ) : (
            <Text style={styles.infoText}>
              {assignment
                ? `Bài giao: ${assignment.taskTitle} · Hạn nộp ${dayjs(assignment.dueDate).format('HH:mm DD/MM/YYYY')}`
                : 'Lớp chưa được giao bài nào.'}
            </Text>
          )}
          {!!assignment && (
            <Text style={styles.infoStrong}>
              {`Đã nộp ${total - notSubmitted}/${total}`}
            </Text>
          )}
        </View>
        {total ? (
          <Table
            rowKey={r => r.user._id}
            size="middle"
            pagination={false}
            columns={columns}
            dataSource={data.learners}
            scroll={{ x: 'max-content', y: 320 }}
          />
        ) : (
          <View style={styles.centerState}>
            <Text style={styles.emptyText}>Lớp chưa có học viên nào.</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <Modal
      open={!!classId}
      onCancel={close}
      footer={null}
      closable={false}
      width={720}
      destroyOnHidden
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {data?.class.name || 'Chi tiết lớp'}
            </Text>
            <Text style={styles.subline}>
              {data ? `Mã lớp ${data.class.code}` : ' '}
            </Text>
          </View>
          <button
            type="button"
            aria-label="Đóng"
            onClick={close}
            style={styles.closeButton as React.CSSProperties}>
            Đóng
          </button>
        </View>
        <View style={styles.body}>
          {renderBody()}
          <View style={styles.footer}>
            <AppButton
              type="primary"
              style={buttonStyle}
              loading={isReminding}
              disabled={!assignment || !notSubmitted || isReminding}
              onClick={handleRemind}>
              Nhắc hàng loạt
            </AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PracticeClassDetailModal;
