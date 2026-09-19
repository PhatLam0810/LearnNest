'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Progress, Segmented, Select, Skeleton } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import {
  ClassProgressRow,
  ClassProgressStatus,
} from '../../redux/RTKQuery/type';
import StateTag from '../StateTag';
import ThemedTable from '../ThemedTable';
import { apiErrorMessage } from '../practiceClassShared';
import { downloadBlob } from '../submissionShared';
import styles from '../ClassCoursesTab/styles';

interface ClassProgressTabProps {
  classId: string;
}

const buttonStyle = { width: 'auto', height: 40 } as const;

const STATUS_TAG: Record<
  ClassProgressStatus,
  { label: string; color: string; bg: string }
> = {
  notStarted: {
    label: 'Chưa bắt đầu',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
  },
  inProgress: {
    label: 'Đang học',
    color: 'var(--color-info)',
    bg: 'var(--color-info-bg)',
  },
  done: {
    label: 'Hoàn thành',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
  },
};

const ClassProgressTab: React.FC<ClassProgressTabProps> = ({ classId }) => {
  const { data: courses, isFetching: loadingCourses } =
    adminQuery.useGetClassCoursesQuery(classId);
  const [picked, setPicked] = useState<string | undefined>();
  const [status, setStatus] = useState<ClassProgressStatus | 'all'>('all');
  // Mặc định khóa đầu tiên của lớp.
  const lessonId = picked ?? courses?.[0]?.lessonId;

  const { data, isFetching, isError, refetch } =
    adminQuery.useGetClassProgressQuery(
      {
        classId,
        lessonId: lessonId ?? '',
        status: status === 'all' ? undefined : status,
      },
      { skip: !lessonId },
    );
  const [remind, { isLoading: isReminding }] =
    adminQuery.useRemindClassLearningMutation();
  const [exportXlsx, { isLoading: isExporting }] =
    adminQuery.useExportClassProgressMutation();

  const summary = data?.summary;

  const handleRemind = async () => {
    if (!lessonId) return;
    try {
      // Bước 1 chỉ đếm ứng viên (dryRun) để admin xác nhận trước khi gửi email.
      const pre = await remind({ classId, lessonId, dryRun: true }).unwrap();
      Modal.confirm({
        title: 'Nhắc học viên chưa học xong?',
        content: `Có ${pre.candidates} học viên chưa hoàn thành khóa. Hệ thống chỉ gửi email cho người đã ngừng học đủ lâu và chưa được nhắc gần đây; người còn lại sẽ được bỏ qua. Không thể thu hồi sau khi gửi.`,
        okText: 'Gửi nhắc',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            const r = await remind({ classId, lessonId }).unwrap();
            messageApi.success(
              `Đã gửi ${r.sent}, bỏ qua ${r.skipped.length} học viên`,
            );
          } catch (err: unknown) {
            messageApi.error(apiErrorMessage(err, 'Gửi nhắc thất bại'));
          }
        },
      });
    } catch (err: unknown) {
      messageApi.error(
        apiErrorMessage(err, 'Không kiểm tra được danh sách nhắc'),
      );
    }
  };

  const handleExport = async () => {
    if (!lessonId) return;
    try {
      const blob = await exportXlsx({ classId, lessonId }).unwrap();
      downloadBlob(blob, 'tien-do-lop.xlsx');
    } catch (err: unknown) {
      messageApi.error(apiErrorMessage(err, 'Xuất Excel thất bại'));
    }
  };

  const columns: TableProps<ClassProgressRow>['columns'] = [
    {
      title: 'Học viên',
      key: 'learner',
      render: (_: unknown, r) => (
        <View>
          <Text style={styles.courseTitle}>{r.fullName || r.email}</Text>
          <Text style={styles.caption}>{r.studentId}</Text>
        </View>
      ),
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_: unknown, r) => (
        <View style={styles.progressCell}>
          <Progress percent={r.percent} size="small" showInfo={false} />
          <Text style={styles.caption}>
            {r.doneItems}/{r.totalItems} mục · {r.percent}%
          </Text>
        </View>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: unknown, r) => <StateTag {...STATUS_TAG[r.status]} />,
    },
    {
      title: 'Lần học cuối',
      key: 'last',
      render: (_: unknown, r) =>
        r.lastActiveAt ? dayjs(r.lastActiveAt).format('DD/MM/YYYY HH:mm') : '—',
    },
  ];

  const renderContent = () => {
    if (loadingCourses || (isFetching && !data)) {
      return (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2, 3].map(k => (
            <Skeleton.Input key={k} active block style={{ height: 40 }} />
          ))}
        </View>
      );
    }
    if (!lessonId) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>
            Lớp chưa có khóa học nào để theo dõi. Hãy gán khóa ở tab Khóa học.
          </Text>
        </View>
      );
    }
    if (isError || !data) {
      return (
        <View style={{ ...styles.centerState, ...styles.errorState }}>
          <Text style={styles.errorText}>Không tải được tiến độ của lớp.</Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!data.items.length) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>
            {status === 'all'
              ? 'Lớp chưa có học viên nào.'
              : 'Không có học viên nào ở trạng thái này.'}
          </Text>
        </View>
      );
    }
    return (
      <ThemedTable
        rowKey="userId"
        columns={columns}
        dataSource={data.items}
        pagination={{ pageSize: 10 }}
      />
    );
  };

  const behind = (summary?.notStarted ?? 0) + (summary?.inProgress ?? 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <Select
          size="large"
          style={{ minWidth: 240, maxWidth: '100%' }}
          placeholder="Chọn khóa học"
          value={lessonId}
          onChange={setPicked}
          disabled={!courses?.length}
          options={(courses ?? []).map(c => ({
            value: c.lessonId,
            label: c.title,
          }))}
        />
        <View style={styles.rowActions}>
          <AppButton
            style={buttonStyle}
            disabled={!lessonId || !behind}
            loading={isReminding}
            onClick={handleRemind}>
            Nhắc người chưa học
          </AppButton>
          <AppButton
            style={buttonStyle}
            disabled={!lessonId}
            loading={isExporting}
            onClick={handleExport}>
            Xuất Excel
          </AppButton>
        </View>
      </View>
      {!!summary && (
        <View style={styles.summaryRow}>
          <Segmented
            value={status}
            onChange={v => setStatus(v as ClassProgressStatus | 'all')}
            options={[
              { value: 'all', label: `Tất cả (${summary.total})` },
              {
                value: 'notStarted',
                label: `Chưa bắt đầu (${summary.notStarted})`,
              },
              {
                value: 'inProgress',
                label: `Đang học (${summary.inProgress})`,
              },
              { value: 'done', label: `Hoàn thành (${summary.done})` },
            ]}
          />
        </View>
      )}
      {renderContent()}
    </View>
  );
};

export default ClassProgressTab;
