'use client';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native-web';
import { Input, Modal, Segmented, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import type { TableProps } from 'antd';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import { ClassItem, ClassStatusValue } from '~mdAdmin/redux/RTKQuery/type';
import { FilteredEmptyState, ThemedTable } from '~mdAdmin/components';
import { downloadBlob } from '~mdAdmin/components/submissionShared';
import ClassFormModal from '~mdAdmin/components/ClassFormModal';
import CreateClassModal from '~mdAdmin/components/CreateClassModal';
import PracticeClassDetailModal from '~mdAdmin/components/PracticeClassDetailModal';
import StateTag from '~mdAdmin/components/StateTag';
import {
  CLASS_ENTITY_STATUS,
  apiErrorMessage,
} from '~mdAdmin/components/practiceClassShared';
import styles from './styles';

type StatusFilter = 'all' | ClassStatusValue;

const PAGE_SIZE = 10;
const buttonStyle = { width: 'auto', height: 40 } as const;

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: CLASS_ENTITY_STATUS.active.label, value: 'active' },
  { label: CLASS_ENTITY_STATUS.archived.label, value: 'archived' },
];

const PracticeClassManage: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [pageNum, setPageNum] = useState(1);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<ClassItem | undefined>();
  const [detailId, setDetailId] = useState<string | undefined>();

  const { data, isFetching, isError, refetch } = adminQuery.useGetClassesQuery({
    status: status === 'all' ? undefined : status,
    search: search || undefined,
    pageNum,
    pageSize: PAGE_SIZE,
  });
  const [updateClass] = adminQuery.useUpdateClassMutation();
  const [exportReport, { isLoading: isExporting }] =
    adminQuery.useExportClassesReportMutation();
  const items = data?.items ?? [];
  const isInitialLoading = isFetching && !data;
  const isFiltered = !!search || status !== 'all';

  // Lưu trữ/lọc làm trang hiện tại hết dòng thì lùi về trang trước.
  useEffect(() => {
    if (data && !data.items.length && pageNum > 1) setPageNum(pageNum - 1);
  }, [data, pageNum]);

  const changeSearch = (value: string) => {
    setSearch(value);
    setPageNum(1);
  };
  const changeStatus = (value: StatusFilter) => {
    setStatus(value);
    setPageNum(1);
  };
  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setPageNum(1);
  };

  const setArchived = async (item: ClassItem, archived: boolean) => {
    try {
      await updateClass({
        classId: item._id,
        body: { status: archived ? 'archived' : 'active' },
      }).unwrap();
      messageApi.success(
        archived ? 'Đã lưu trữ lớp học' : 'Đã khôi phục lớp học',
      );
    } catch (err: unknown) {
      messageApi.error(apiErrorMessage(err, 'Cập nhật lớp học thất bại'));
    }
  };

  const confirmArchive = (item: ClassItem) =>
    Modal.confirm({
      title: `Lưu trữ lớp ${item.code}?`,
      content:
        'Lớp đã lưu trữ không thêm được học viên mới. Dữ liệu học viên và bài giao vẫn được giữ, bạn có thể khôi phục lớp bất cứ lúc nào.',
      okText: 'Lưu trữ',
      cancelText: 'Hủy',
      onOk: () => setArchived(item, true),
    });

  const handleExport = async () => {
    try {
      downloadBlob(await exportReport().unwrap(), 'bao-cao-lop.xlsx');
    } catch (err: unknown) {
      messageApi.error(apiErrorMessage(err, 'Xuất báo cáo thất bại'));
    }
  };

  const openEdit = (item: ClassItem) => {
    setEditing(item);
    setIsFormOpen(true);
  };

  const columns: TableProps<ClassItem>['columns'] = [
    {
      title: 'Mã lớp',
      key: 'code',
      render: (_: unknown, r) => (
        <Text style={styles.cellStrong}>{r.code}</Text>
      ),
    },
    {
      title: 'Tên lớp',
      key: 'name',
      render: (_: unknown, r) => r.name,
    },
    {
      title: 'Học kỳ',
      key: 'termLabel',
      render: (_: unknown, r) => r.termLabel || '—',
    },
    {
      title: 'Số học viên',
      key: 'members',
      align: 'right',
      render: (_: unknown, r) => r.memberCount,
    },
    {
      title: 'Khóa học được phân',
      key: 'courses',
      render: (_: unknown, r) =>
        r.courseTitles?.length ? (
          <View style={styles.tagRow}>
            {r.courseTitles.map(t => (
              <StateTag
                key={t}
                label={t}
                color="var(--color-vhu-primary)"
                bg="var(--color-info-bg)"
              />
            ))}
          </View>
        ) : (
          <Text style={styles.mutedText}>Chưa phân khóa</Text>
        ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: unknown, r) => {
        const s = CLASS_ENTITY_STATUS[r.status];
        return <StateTag label={s.label} color={s.color} bg={s.bg} />;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_: unknown, r) => (
        // Bấm nút không được lọt lên onClick của dòng (mở chi tiết).
        <View style={styles.actionGroup} onClick={e => e.stopPropagation()}>
          <button
            type="button"
            style={styles.actionButton as React.CSSProperties}
            onClick={() => openEdit(r)}>
            Sửa
          </button>
          <button
            type="button"
            style={styles.actionButton as React.CSSProperties}
            onClick={() =>
              r.status === 'archived'
                ? setArchived(r, false)
                : confirmArchive(r)
            }>
            {r.status === 'archived' ? 'Bỏ lưu trữ' : 'Lưu trữ'}
          </button>
        </View>
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
            Không tải được danh sách lớp học.
          </Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!items.length && !isFiltered) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.emptyText}>Chưa có lớp học nào.</Text>
          <AppButton
            type="primary"
            style={buttonStyle}
            onClick={() => {
              setEditing(undefined);
              setIsFormOpen(true);
            }}>
            Tạo lớp học
          </AppButton>
        </View>
      );
    }
    const activeFilter = [
      search,
      status !== 'all' ? CLASS_ENTITY_STATUS[status].label : '',
    ]
      .filter(Boolean)
      .join(' · ');
    return (
      <ThemedTable
        rowKey="_id"
        loading={isFetching}
        columns={columns}
        dataSource={items}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: pageNum,
          pageSize: PAGE_SIZE,
          total: data?.totalRecords ?? 0,
          showSizeChanger: false,
          hideOnSinglePage: true,
        }}
        onChange={p => setPageNum(p.current ?? 1)}
        onRow={r => ({ onClick: () => setDetailId(r._id) })}
        locale={{
          emptyText: (
            <FilteredEmptyState query={activeFilter} onClear={clearFilters} />
          ),
        }}
      />
    );
  };

  // Chi tiết lớp mở NGAY trong tab (theo thiết kế), có nút quay lại danh sách.
  if (detailId) {
    return (
      <View style={styles.page}>
        <PracticeClassDetailModal
          inline
          classId={detailId}
          onClose={() => setDetailId(undefined)}
        />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.toolbarRow}>
        <View style={styles.toolbarLeft}>
          <Input.Search
            allowClear
            size="large"
            aria-label="Tìm lớp học"
            placeholder="Tìm theo mã lớp hoặc tên lớp"
            onSearch={changeSearch}
            style={{ maxWidth: 360 }}
          />
          <Segmented
            aria-label="Lọc theo trạng thái"
            options={STATUS_OPTIONS}
            value={status}
            onChange={v => changeStatus(v as StatusFilter)}
          />
        </View>
        <View style={styles.toolbarRight}>
          <AppButton
            style={buttonStyle}
            loading={isExporting}
            onClick={handleExport}>
            Xuất báo cáo lớp
          </AppButton>
          <AppButton
            style={buttonStyle}
            onClick={() => router.push('/dashboard/admin?tab=2')}>
            Nhập từ Excel
          </AppButton>
          <AppButton style={buttonStyle} onClick={() => setIsAssignOpen(true)}>
            Tạo lớp và giao bài
          </AppButton>
          <AppButton
            type="primary"
            style={buttonStyle}
            onClick={() => {
              setEditing(undefined);
              setIsFormOpen(true);
            }}>
            Tạo lớp học
          </AppButton>
        </View>
      </View>
      {renderContent()}
      <ClassFormModal
        open={isFormOpen}
        classItem={editing}
        onClose={() => setIsFormOpen(false)}
      />
      <CreateClassModal
        open={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
      />
    </View>
  );
};

export default PracticeClassManage;
