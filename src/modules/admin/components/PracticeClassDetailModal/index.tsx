'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Select, Skeleton } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import UserAvatar from '@components/UserAvatar';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { ClassRosterLearner } from '../../redux/RTKQuery/type';
import StateTag from '../StateTag';
import ClassMembersTab from '../ClassMembersTab';
import ClassCoursesTab from '../ClassCoursesTab';
import ClassProgressTab from '../ClassProgressTab';
import ThemedTable from '../ThemedTable';
import { LEARNER_STATE } from '../practiceClassShared';
import styles from './styles';

interface PracticeClassDetailModalProps {
  classId?: string;
  onClose: () => void;
  // true = hiện trong trang (không modal), có nút quay lại danh sách.
  inline?: boolean;
}

const buttonStyle = { width: 'auto', height: 40 } as const;

const TABS = [
  { key: 'members', label: 'Học viên' },
  { key: 'courses', label: 'Khóa học' },
  { key: 'progress', label: 'Tiến độ' },
  { key: 'assignments', label: 'Bài giao' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

const PracticeClassDetailModal: React.FC<PracticeClassDetailModalProps> = ({
  classId,
  onClose,
  inline = false,
}) => {
  const [tab, setTab] = useState<TabKey>('members');
  const [assignmentId, setAssignmentId] = useState<string | undefined>();
  // Tên/mã/trạng thái lớp cho header - nhẹ hơn roster (không tải cả danh sách
  // học viên), roster chỉ tải khi mở tab "Bài giao".
  const { data: classInfo } = adminQuery.useGetClassByIdQuery(classId ?? '', {
    skip: !classId,
  });
  const { data, isFetching, isError, refetch } =
    adminQuery.useGetPracticeClassRosterQuery(
      { classId: classId ?? '', assignmentId },
      { skip: !classId || tab !== 'assignments' },
    );
  const [remind, { isLoading: isReminding }] =
    adminQuery.useRemindClassAssignmentMutation();

  const close = () => {
    setTab('members');
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

  const renderAssignments = () => {
    if (isFetching && !data) {
      return (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2, 3, 4, 5].map(k => (
            <Skeleton.Input key={k} active block style={{ height: 40 }} />
          ))}
        </View>
      );
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
          <ThemedTable
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

  const tabsAndBody = (
    <>
      <div role="tablist" style={styles.tabStrip as React.CSSProperties}>
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            style={
              (tab === t.key
                ? { ...styles.tab, ...styles.tabActive }
                : styles.tab) as React.CSSProperties
            }>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'members' && !!classId && (
        <ClassMembersTab
          classId={classId}
          archived={classInfo?.status === 'archived'}
        />
      )}
      {tab === 'courses' && !!classId && (
        <ClassCoursesTab
          classId={classId}
          archived={classInfo?.status === 'archived'}
        />
      )}
      {tab === 'progress' && !!classId && (
        <ClassProgressTab classId={classId} />
      )}
      {tab === 'assignments' && (
        <>
          {renderAssignments()}
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
        </>
      )}
    </>
  );

  // Chế độ inline (theo thiết kế): chi tiết lớp mở NGAY trong tab thay cho danh
  // sách, có nút quay lại - không phải modal.
  if (inline) {
    if (!classId) return null;
    return (
      <View style={styles.inlineWrap}>
        <View style={styles.inlineHeader}>
          <button
            type="button"
            aria-label="Quay lại danh sách lớp"
            onClick={close}
            style={styles.backButton as React.CSSProperties}>
            ←
          </button>
          <View style={styles.headerText}>
            <Text style={styles.inlineTitle}>
              {classInfo?.name || 'Chi tiết lớp'}
              {!!classInfo && (
                <Text style={styles.inlineCode}> ({classInfo.code})</Text>
              )}
            </Text>
            <Text style={styles.inlineSubline}>
              {classInfo
                ? `${classInfo.termLabel ? `${classInfo.termLabel} · ` : ''}${classInfo.memberCount} học viên`
                : ' '}
            </Text>
          </View>
        </View>
        <View style={styles.inlineBody}>{tabsAndBody}</View>
      </View>
    );
  }

  return (
    <Modal
      open={!!classId}
      onCancel={close}
      footer={null}
      closable={false}
      width={1120}
      destroyOnHidden
      styles={{ body: { padding: 0 }, content: { padding: 0 } }}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {classInfo?.name || 'Chi tiết lớp'}
            </Text>
            <Text style={styles.subline}>
              {classInfo ? `Mã lớp ${classInfo.code}` : ' '}
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
        <View style={styles.body}>{tabsAndBody}</View>
      </View>
    </Modal>
  );
};

export default PracticeClassDetailModal;
