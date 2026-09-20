'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Input, Modal, Skeleton } from 'antd';
import type { TableProps } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import UserAvatar from '@components/UserAvatar';
import { adminQuery } from '~mdAdmin/redux';
import { ClassMember } from '../../redux/RTKQuery/type';
import ClassAddMembersModal from '../ClassAddMembersModal';
import ClassMoveMembersModal from '../ClassMoveMembersModal';
import FilteredEmptyState from '../FilteredEmptyState';
import ThemedTable from '../ThemedTable';
import { apiErrorMessage } from '../practiceClassShared';
import styles from './styles';

interface ClassMembersTabProps {
  classId: string;
  // Lớp đã lưu trữ: BE từ chối thêm học viên mới.
  archived: boolean;
}

const PAGE_SIZE = 10;
const buttonStyle = { width: 'auto', height: 40 } as const;

const ClassMembersTab: React.FC<ClassMembersTabProps> = ({
  classId,
  archived,
}) => {
  const [search, setSearch] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const { data, isFetching, isError, refetch } =
    adminQuery.useGetClassMembersQuery({
      classId,
      search: search || undefined,
      pageNum,
      pageSize: PAGE_SIZE,
    });
  const [removeMember] = adminQuery.useRemovePracticeClassMemberMutation();
  const items = data?.items ?? [];

  const changeSearch = (value: string) => {
    setSearch(value.trim());
    setPageNum(1);
  };

  const handleRemove = (member: ClassMember) => {
    Modal.confirm({
      title: 'Gỡ học viên khỏi lớp?',
      content: `${member.fullName || member.email || 'Học viên này'} sẽ bị gỡ khỏi lớp. Tài khoản không bị xóa, bạn có thể thêm lại vào lớp sau.`,
      okText: 'Gỡ khỏi lớp',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await removeMember({ classId, userId: member._id }).unwrap();
          messageApi.success('Đã gỡ học viên khỏi lớp');
          setSelected(prev => prev.filter(id => id !== member._id));
          // Gỡ dòng cuối của trang cuối thì lùi 1 trang, tránh trang rỗng.
          if (items.length === 1 && pageNum > 1) setPageNum(pageNum - 1);
        } catch (err: unknown) {
          messageApi.error(apiErrorMessage(err, 'Gỡ học viên thất bại'));
        }
      },
    });
  };

  const columns: TableProps<ClassMember>['columns'] = [
    {
      title: 'Học viên',
      key: 'learner',
      render: (_: unknown, r) => (
        <View style={styles.learnerCell}>
          <UserAvatar size={32} fullName={r.fullName || r.email} seed={r._id} />
          <View>
            <Text style={styles.learnerName}>
              {r.fullName || r.email || 'Học viên'}
            </Text>
            {!!r.fullName && !!r.email && (
              <Text style={styles.caption}>{r.email}</Text>
            )}
          </View>
        </View>
      ),
    },
    {
      title: 'MSSV',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (v?: string) => v || '—',
    },
    {
      title: 'Lớp cũ',
      dataIndex: 'class',
      key: 'class',
      render: (v?: string) => v || '—',
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_: unknown, r) => (
        <View style={styles.rowActions}>
          <button
            type="button"
            style={styles.moveButton as React.CSSProperties}
            disabled={archived}
            onClick={() => {
              setSelected([r._id]);
              setIsMoveOpen(true);
            }}>
            Chuyển lớp
          </button>
          <button
            type="button"
            style={styles.actionButton as React.CSSProperties}
            onClick={() => handleRemove(r)}>
            Gỡ khỏi lớp
          </button>
        </View>
      ),
    },
  ];

  const renderContent = () => {
    if (isFetching && !data) {
      return (
        <View style={styles.skeletonWrap}>
          {[0, 1, 2, 3, 4].map(k => (
            <Skeleton.Input key={k} active block style={{ height: 40 }} />
          ))}
        </View>
      );
    }
    if (isError || !data) {
      return (
        <View style={{ ...styles.centerState, ...styles.errorState }}>
          <Text style={styles.errorText}>
            Không tải được danh sách học viên.
          </Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!items.length && !search) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>Lớp chưa có học viên nào.</Text>
          <AppButton
            type="primary"
            style={buttonStyle}
            disabled={archived}
            onClick={() => setIsAddOpen(true)}>
            Thêm học viên
          </AppButton>
        </View>
      );
    }
    return (
      <ThemedTable
        rowKey="_id"
        size="middle"
        loading={isFetching}
        columns={columns}
        dataSource={items}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys: selected,
          preserveSelectedRowKeys: true,
          onChange: keys => setSelected(keys as string[]),
        }}
        pagination={{
          current: pageNum,
          pageSize: PAGE_SIZE,
          total: data.totalRecords,
          showSizeChanger: false,
          hideOnSinglePage: true,
        }}
        onChange={p => setPageNum(p.current ?? 1)}
        locale={{
          emptyText: (
            <FilteredEmptyState
              query={search}
              onClear={() => changeSearch('')}
            />
          ),
        }}
      />
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <View style={styles.searchWrap}>
          <Input.Search
            allowClear
            aria-label="Tìm học viên trong lớp"
            placeholder="Tìm theo tên, email hoặc MSSV"
            onSearch={changeSearch}
          />
        </View>
        <AppButton
          type="primary"
          style={buttonStyle}
          disabled={archived}
          onClick={() => setIsAddOpen(true)}>
          Thêm học viên
        </AppButton>
        <AppButton
          style={buttonStyle}
          disabled={!selected.length}
          onClick={() => setIsMoveOpen(true)}>
          {selected.length
            ? `Chuyển sang lớp khác (${selected.length})`
            : 'Chuyển sang lớp khác'}
        </AppButton>
      </View>
      {archived && (
        <Text style={styles.hint}>
          Lớp đã lưu trữ nên không thêm được học viên mới. Khôi phục lớp ở nút
          Sửa ngoài danh sách để thêm lại.
        </Text>
      )}
      {renderContent()}
      <ClassAddMembersModal
        open={isAddOpen}
        classId={classId}
        onClose={() => setIsAddOpen(false)}
      />
      <ClassMoveMembersModal
        open={isMoveOpen}
        classId={classId}
        userIds={selected}
        onClose={() => setIsMoveOpen(false)}
        onMoved={() => {
          setSelected([]);
          setPageNum(1);
        }}
      />
    </View>
  );
};

export default ClassMembersTab;
