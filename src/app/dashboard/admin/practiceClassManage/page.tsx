'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Skeleton } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import { adminQuery } from '~mdAdmin/redux';
import { ClassOverviewItem } from '~mdAdmin/redux/RTKQuery/type';
import {
  ContentToolbar,
  FilteredEmptyState,
  ThemedTable,
} from '~mdAdmin/components';
import CreateClassModal from '~mdAdmin/components/CreateClassModal';
import PracticeClassDetailModal from '~mdAdmin/components/PracticeClassDetailModal';
import StateTag from '~mdAdmin/components/StateTag';
import {
  CLASS_STATUS,
  classStatus,
} from '~mdAdmin/components/practiceClassShared';
import styles from './styles';

const buttonStyle = { width: 'auto', height: 40 } as const;

const PracticeClassManage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | undefined>();

  const { data, isFetching, isError, refetch } =
    adminQuery.useGetPracticeClassOverviewQuery(search || undefined);
  const items = data ?? [];
  const isInitialLoading = isFetching && !data;

  const columns: TableProps<ClassOverviewItem>['columns'] = [
    {
      title: 'Mã lớp',
      key: 'code',
      render: (_: unknown, r) => (
        <View>
          <Text style={styles.cellStrong}>{r.code}</Text>
          {r.name !== r.code && <Text style={styles.cellMuted}>{r.name}</Text>}
        </View>
      ),
    },
    {
      title: 'Bài thực hành',
      key: 'task',
      render: (_: unknown, r) =>
        r.assignment ? (
          <View>
            <Text style={styles.cellStrong}>{r.assignment.taskTitle}</Text>
            {r.assignmentCount > 1 && (
              <Text
                style={
                  styles.cellMuted
                }>{`+${r.assignmentCount - 1} bài khác`}</Text>
            )}
          </View>
        ) : (
          '—'
        ),
    },
    {
      title: 'Số học viên',
      key: 'members',
      align: 'right',
      render: (_: unknown, r) => r.memberCount,
    },
    {
      title: 'Hạn nộp',
      key: 'due',
      render: (_: unknown, r) =>
        r.assignment
          ? dayjs(r.assignment.dueDate).format('HH:mm DD/MM/YYYY')
          : '—',
    },
    {
      title: 'Đã nộp / Tổng',
      key: 'submitted',
      align: 'right',
      render: (_: unknown, r) =>
        r.assignment ? `${r.submittedCount}/${r.memberCount}` : '—',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: unknown, r) => {
        const s = CLASS_STATUS[classStatus(r)];
        return <StateTag label={s.label} color={s.color} bg={s.bg} />;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_: unknown, r) => (
        <button
          type="button"
          style={styles.actionButton as React.CSSProperties}
          onClick={e => {
            e.stopPropagation();
            setDetailId(r._id);
          }}>
          Xem chi tiết
        </button>
      ),
    },
  ];

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2, 3, 4].map(k => (
            <Skeleton.Input key={k} active block style={{ height: 40 }} />
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <View style={{ ...styles.stateWrap, ...styles.errorWrap }}>
          <Text style={styles.errorText}>
            Không tải được danh sách lớp thực hành.
          </Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!items.length && !search) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.emptyText}>Chưa có lớp thực hành nào.</Text>
          <AppButton
            type="primary"
            style={buttonStyle}
            onClick={() => setIsCreateOpen(true)}>
            Tạo lớp thực hành
          </AppButton>
        </View>
      );
    }
    return (
      <ThemedTable
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={items}
        pagination={{ pageSize: 10 }}
        onRow={r => ({ onClick: () => setDetailId(r._id) })}
        locale={{
          emptyText: (
            <FilteredEmptyState query={search} onClear={() => setSearch('')} />
          ),
        }}
      />
    );
  };

  return (
    <View style={styles.page}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Quản lý lớp thực hành</Text>
        <Text style={styles.subtitle}>
          Theo dõi tiến độ nộp bài của từng lớp, nhắc học viên và tạo lớp mới.
        </Text>
      </View>
      <ContentToolbar
        searchPlaceholder="Tìm theo mã lớp hoặc tên lớp"
        onSearch={setSearch}
        addLabel="Tạo lớp thực hành"
        onAdd={() => setIsCreateOpen(true)}
      />
      {renderContent()}
      <CreateClassModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <PracticeClassDetailModal
        classId={detailId}
        onClose={() => setDetailId(undefined)}
      />
    </View>
  );
};

export default PracticeClassManage;
