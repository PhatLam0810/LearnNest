'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { DatePicker, Modal, Select, Skeleton } from 'antd';
import type { TableProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import AppButton from '@components/AppButton';
import { messageApi, useAppPagination } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { ClassCourseItem } from '../../redux/RTKQuery/type';
import StateTag from '../StateTag';
import ThemedTable from '../ThemedTable';
import { apiErrorMessage } from '../practiceClassShared';
import styles from './styles';

interface ClassCoursesTabProps {
  classId: string;
  archived: boolean;
}

const buttonStyle = { width: 'auto', height: 40 } as const;
const formatDate = (v: string | null) =>
  v ? dayjs(v).format('DD/MM/YYYY') : null;

const ACCESS_TAG = {
  public: {
    label: 'Công khai',
    color: 'var(--color-info)',
    bg: 'var(--color-info-bg)',
  },
  class: {
    label: 'Chỉ lớp được phân',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
  },
} as const;

const ClassCoursesTab: React.FC<ClassCoursesTabProps> = ({
  classId,
  archived,
}) => {
  const { data, isFetching, isError, refetch } =
    adminQuery.useGetClassCoursesQuery(classId);
  const [assign, { isLoading: isAssigning }] =
    adminQuery.useAssignClassCourseMutation();
  const [update, { isLoading: isUpdating }] =
    adminQuery.useUpdateClassCourseMutation();
  const [remove] = adminQuery.useRemoveClassCourseMutation();
  const { listItem: lessons } = useAppPagination<{
    _id: string;
    title: string;
  }>({ apiUrl: 'lesson/getAllLesson' });

  // editing = khóa đang sửa ngày; adding = mở modal gán khóa mới.
  const [editing, setEditing] = useState<ClassCourseItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [lessonId, setLessonId] = useState<string | undefined>();
  const [startAt, setStartAt] = useState<Dayjs | null>(null);
  const [endAt, setEndAt] = useState<Dayjs | null>(null);

  const items = data ?? [];
  const assignedIds = new Set(items.map(i => i.lessonId));
  const modalOpen = adding || !!editing;
  const isSaving = isAssigning || isUpdating;

  const openAdd = () => {
    setLessonId(undefined);
    setStartAt(null);
    setEndAt(null);
    setAdding(true);
  };
  const openEdit = (item: ClassCourseItem) => {
    setEditing(item);
    setLessonId(item.lessonId);
    setStartAt(item.startAt ? dayjs(item.startAt) : null);
    setEndAt(item.endAt ? dayjs(item.endAt) : null);
  };
  const closeModal = () => {
    setAdding(false);
    setEditing(null);
  };

  const dateError =
    startAt && endAt && endAt.isBefore(startAt)
      ? 'Ngày kết thúc phải sau ngày bắt đầu'
      : '';

  const handleSave = async () => {
    if (!lessonId || dateError) return;
    // Sửa: gửi null để xóa mốc đã bỏ trống; gán mới: chỉ gửi mốc có giá trị.
    const dates = editing
      ? {
          startAt: startAt ? startAt.startOf('day').toISOString() : null,
          endAt: endAt ? endAt.endOf('day').toISOString() : null,
        }
      : {
          ...(startAt ? { startAt: startAt.startOf('day').toISOString() } : {}),
          ...(endAt ? { endAt: endAt.endOf('day').toISOString() } : {}),
        };
    try {
      if (editing) {
        await update({ classId, lessonId, body: dates }).unwrap();
        messageApi.success('Đã cập nhật thời gian học');
      } else {
        await assign({ classId, body: { lessonId, ...dates } }).unwrap();
        messageApi.success('Đã gán khóa học, cả lớp được ghi danh');
      }
      closeModal();
    } catch (err: unknown) {
      messageApi.error(apiErrorMessage(err, 'Lưu khóa học của lớp thất bại'));
    }
  };

  const handleRemove = (item: ClassCourseItem) => {
    Modal.confirm({
      title: 'Gỡ khóa học khỏi lớp?',
      content: `Lớp sẽ không còn được phân "${item.title}". Tiến độ và điểm của học viên vẫn được giữ nguyên.${
        item.accessMode === 'class'
          ? ' Khóa này chỉ dành cho lớp được phân nên học viên sẽ không vào học tiếp được.'
          : ''
      }`,
      okText: 'Gỡ khóa học',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await remove({ classId, lessonId: item.lessonId }).unwrap();
          messageApi.success('Đã gỡ khóa học khỏi lớp');
        } catch (err: unknown) {
          messageApi.error(apiErrorMessage(err, 'Gỡ khóa học thất bại'));
        }
      },
    });
  };

  const columns: TableProps<ClassCourseItem>['columns'] = [
    {
      title: 'Khóa học',
      key: 'title',
      render: (_: unknown, r) => (
        <View>
          <Text style={styles.courseTitle}>{r.title}</Text>
          {r.source === 'legacy' && (
            <Text style={styles.caption}>Gắn từ lớp thực hành cũ</Text>
          )}
        </View>
      ),
    },
    {
      title: 'Bắt đầu',
      key: 'startAt',
      render: (_: unknown, r) => formatDate(r.startAt) ?? '—',
    },
    {
      title: 'Kết thúc',
      key: 'endAt',
      render: (_: unknown, r) => formatDate(r.endAt) ?? '—',
    },
    {
      title: 'Chế độ',
      key: 'mode',
      render: (_: unknown, r) => <StateTag {...ACCESS_TAG[r.accessMode]} />,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_: unknown, r) => (
        <View style={styles.rowActions}>
          <button
            type="button"
            style={styles.linkButton as React.CSSProperties}
            disabled={archived || r.source === 'legacy'}
            onClick={() => openEdit(r)}>
            Sửa ngày
          </button>
          <button
            type="button"
            style={styles.dangerButton as React.CSSProperties}
            disabled={archived || r.source === 'legacy'}
            onClick={() => handleRemove(r)}>
            Gỡ
          </button>
        </View>
      ),
    },
  ];

  const renderContent = () => {
    if (isFetching && !data) {
      return (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2].map(k => (
            <Skeleton.Input key={k} active block style={{ height: 40 }} />
          ))}
        </View>
      );
    }
    if (isError || !data) {
      return (
        <View style={{ ...styles.centerState, ...styles.errorState }}>
          <Text style={styles.errorText}>Không tải được khóa học của lớp.</Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!items.length) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>
            Lớp chưa được phân khóa học nào. Gán khóa để cả lớp được ghi danh tự
            động.
          </Text>
          <AppButton
            type="primary"
            style={buttonStyle}
            disabled={archived}
            onClick={openAdd}>
            Gán khóa học
          </AppButton>
        </View>
      );
    }
    return (
      <ThemedTable
        rowKey="lessonId"
        columns={columns}
        dataSource={items}
        pagination={false}
      />
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <Text style={styles.hint}>
          Gán khóa cho lớp: học viên hiện tại và học viên thêm sau đều tự được
          ghi danh. Gỡ khóa không xóa tiến độ.
        </Text>
        {!!items.length && (
          <AppButton
            type="primary"
            style={buttonStyle}
            disabled={archived}
            onClick={openAdd}>
            Gán khóa học
          </AppButton>
        )}
      </View>
      {renderContent()}
      <Modal
        open={modalOpen}
        onCancel={closeModal}
        destroyOnClose
        title={editing ? 'Sửa thời gian học' : 'Gán khóa học cho lớp'}
        footer={null}
        width={520}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Khóa học</Text>
            <Select
              showSearch
              size="large"
              disabled={!!editing}
              optionFilterProp="label"
              placeholder="Chọn khóa học"
              value={lessonId}
              onChange={setLessonId}
              options={(editing
                ? items.map(i => ({ _id: i.lessonId, title: i.title }))
                : lessons
              ).map(l => ({
                value: l._id,
                label: l.title,
                disabled: !editing && assignedIds.has(l._id),
              }))}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Ngày bắt đầu (tùy chọn)</Text>
            <DatePicker
              size="large"
              style={{ width: '100%' }}
              value={startAt}
              onChange={setStartAt}
              format="DD/MM/YYYY"
              placeholder="Không giới hạn"
              popupClassName="picker-fit-mobile"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Ngày kết thúc (tùy chọn)</Text>
            <DatePicker
              size="large"
              style={{ width: '100%' }}
              value={endAt}
              onChange={setEndAt}
              format="DD/MM/YYYY"
              placeholder="Không giới hạn"
              status={dateError ? 'error' : undefined}
              popupClassName="picker-fit-mobile"
            />
            {!!dateError && <Text style={styles.errorText}>{dateError}</Text>}
          </View>
          <View style={styles.formActions}>
            <AppButton style={buttonStyle} onClick={closeModal}>
              Hủy
            </AppButton>
            <AppButton
              type="primary"
              style={buttonStyle}
              loading={isSaving}
              disabled={!lessonId || !!dateError}
              onClick={handleSave}>
              Lưu
            </AppButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClassCoursesTab;
