'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import {
  Space,
  Table,
  TableProps,
  Modal,
  Button,
  Form,
  Input,
  Card,
  Segmented,
  InputNumber,
  Dropdown,
  Tag,
} from 'antd';
import type { MenuProps } from 'antd';
import { ControlOutlined, MoreOutlined } from '@components/AppIcon';
import { useAppSelector } from '@redux';
import { useAppPagination } from '@hooks';
import { UserItem } from '~mdDashboard/types';
import { adminQuery } from '~mdAdmin/redux';
import dayjs from 'dayjs';
import CreateUserForm from '~mdAdmin/components/CreateUserForm';
import { authQuery } from '~mdAuth/redux/RTKQuery';
import dynamic from 'next/dynamic';
import StatCard from '../../home/_components/StatCard';
import StateTag from '~mdAdmin/components/StateTag';
import AdminGuide from '~mdAdmin/components/AdminGuide';
import UserBulkActions from '~mdAdmin/components/UserBulkActions';
import StudentProfileDrawer from '~mdAdmin/components/StudentProfileDrawer';
import { messageApi } from '@hooks';
import { downloadBlob } from '~mdAdmin/components/submissionShared';
import {
  useGrantPremiumMutation,
  useRevokePremiumMutation,
} from '@/modules/premium/redux/RTKQuery';

const TrafficChart = dynamic(() => import('./components/TrafficChart'), {
  ssr: false,
  loading: () => <Card style={{ height: 350, marginBottom: 16 }} loading />,
});
const UserManage = () => {
  const {
    listItem,
    setListItem,
    currentData,
    refresh,
    search,
    fetchData,
    filter,
  } = useAppPagination<UserItem>({
    apiUrl: 'user/getListUser',
    params: { pageSize: 10 },
  });
  const myId = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile?._id,
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [mosOnly, setMosOnly] = useState(false);
  const buildFilter = (type?: string, mos = false) =>
    type || mos
      ? {
          ...(type ? { userType: type } : {}),
          ...(mos ? { mosAccess: true } : {}),
        }
      : undefined;
  const [exportUsers, { isLoading: isExporting }] =
    adminQuery.useExportUsersMutation();
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [isModalCreateUserOpen, setIsModalCreateUserOpen] = useState(false);
  const [setAdminRole, { isLoading: isChangingRole }] =
    adminQuery.useSetUserAdminRoleMutation();
  // Hộp xác nhận dạng khai báo: Modal.confirm() không hiện ở trang này.
  const [roleChange, setRoleChange] = useState<{
    user: UserItem;
    isAdmin: boolean;
  } | null>(null);
  const [updateUserInfo, { isLoading: isSavingInfo }] =
    adminQuery.useUpdateUserInfoMutation();
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [editForm] = Form.useForm();
  const openEditUser = (u: UserItem) => {
    setEditUser(u);
    editForm.setFieldsValue({
      fullName: u.fullName,
      class: u.class,
      faculty: u.faculty,
      major: u.major,
      phoneNumber: u.phoneNumber,
    });
  };
  const handleSaveInfo = async () => {
    if (!editUser) return;
    try {
      const values = await editForm.validateFields();
      await updateUserInfo({ userId: editUser._id, ...values }).unwrap();
      messageApi.success('Đã cập nhật thông tin');
      setEditUser(null);
      refresh();
    } catch (e) {
      const msg = (e as { data?: { message?: string } })?.data?.message;
      if (msg) messageApi.error(msg);
    }
  };
  const [isModalDeleteUser, setModalDeleteUser] = useState(false);
  const [infoUser, setInfoUser] = useState<UserItem>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [deleteAccount] = authQuery.useDeleteAccountMutation();
  const [grantPremium, { isLoading: isGranting }] = useGrantPremiumMutation();
  const [revokePremium] = useRevokePremiumMutation();
  const [grantUser, setGrantUser] = useState<UserItem>(null);
  const [grantDays, setGrantDays] = useState(30);
  const [resetTarget, setResetTarget] = useState<UserItem>(null);
  const [resetPassword, { isLoading: isResetting }] =
    adminQuery.useResetUserPasswordsMutation();
  const handleResetPassword = async () => {
    try {
      const r = await resetPassword({ userIds: [resetTarget._id] }).unwrap();
      const issue = [...r.skipped, ...r.failed][0];
      if (r.reset > 0) {
        messageApi.success(
          `Đã đặt mật khẩu mới và gửi về ${resetTarget.email}`,
        );
      } else {
        messageApi.error(issue?.reason || 'Không đặt lại được mật khẩu');
      }
      setResetTarget(null);
    } catch (error) {
      messageApi.error(error?.data?.message || 'Đặt lại mật khẩu thất bại');
    }
  };
  const [mosUser, setMosUser] = useState<UserItem>(null);
  const [mosDays, setMosDays] = useState(30);
  const [extendMos, { isLoading: isExtendingMos }] =
    adminQuery.useExtendMosAccessMutation();
  const [setMosAccess, { isLoading: isRevokingMos }] =
    adminQuery.useSetMosAccessMutation();
  const mosExpired = (u?: UserItem) =>
    !!u?.mosAccess &&
    !!u.mosExpiresAt &&
    dayjs(u.mosExpiresAt).isBefore(dayjs());
  const handleExtendMos = async () => {
    try {
      const r = await extendMos({
        userId: mosUser._id,
        days: mosDays,
      }).unwrap();
      messageApi.success(
        `Đã cấp quyền app MOS đến ${dayjs(r.mosExpiresAt).format('DD/MM/YYYY')}`,
      );
      setMosUser(null);
      refresh();
    } catch (error) {
      messageApi.error(error?.data?.message || 'Cấp quyền app MOS thất bại');
    }
  };
  const handleRevokeMos = async () => {
    try {
      await setMosAccess({
        studentIds: [mosUser.studentId],
        enabled: false,
      }).unwrap();
      messageApi.success('Đã thu hồi quyền app MOS');
      setMosUser(null);
      refresh();
    } catch (error) {
      messageApi.error(error?.data?.message || 'Thu hồi thất bại');
    }
  };
  const { Search } = Input;
  const contextHolder = null;

  // Card "Tạo người dùng mới" ở tab "Tạo Người Dùng" (CreateUserForm) là 1
  // component riêng, không share state với danh sách ở đây - bắn event khi
  // tạo xong để tự làm mới thay vì phải nâng state lên AdminPage.
  useEffect(() => {
    const handleUserCreated = () => refresh();
    window.addEventListener('learnnest:user-created', handleUserCreated);
    return () =>
      window.removeEventListener('learnnest:user-created', handleUserCreated);
  }, [refresh]);

  // Xuất đúng tập đang lọc/tìm kiếm chứ không chỉ trang đang xem.
  const handleExport = async () => {
    try {
      const blob = await exportUsers({
        search: searchTerm || undefined,
        filter: buildFilter(typeFilter, mosOnly),
      }).unwrap();
      downloadBlob(blob, 'nguoi-dung.xlsx');
    } catch {
      messageApi.error('Xuất Excel thất bại');
    }
  };

  // antd chèn 1 hàng đo lường (aria-hidden, chứa vùng cuộn focus được) khi bảng
  // có cột chọn; axe báo aria-hidden-focus. Đánh dấu inert, theo dõi DOM vì
  // antd vẽ lại hàng này.
  useEffect(() => {
    const root = tableWrapRef.current;
    if (!root) return;
    const strip = () =>
      root.querySelectorAll('tr.ant-table-measure-row').forEach(el => {
        if (el.hasAttribute('tabindex')) el.removeAttribute('tabindex');
        // hàng đo lường chứa vùng cuộn (focus được) mà lại aria-hidden -> inert
        if (!el.hasAttribute('inert')) el.setAttribute('inert', '');
      });
    strip();
    const observer = new MutationObserver(strip);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex'],
    });
    return () => observer.disconnect();
  }, []);

  const handleDeleteUser = async (_id: string) => {
    try {
      await deleteAccount({
        Userid: _id,
      });
      messageApi.success('Xóa tài khoản thành công');
      // Trước đây gọi refresh() (xoá sạch listItem rồi fetch lại trang 1) -
      // với danh sách thật nhiều dòng, khoảng thời gian "rỗng rồi fetch lại"
      // khiến cả bảng + biểu đồ render lại 2 lần liên tiếp, tạo cảm giác
      // trang bị đứng khựng vài giây sau mỗi lần xoá. Chỉ cần bỏ đúng 1
      // dòng vừa xoá khỏi state hiện có - khỏi phải fetch lại cả trang.
      setListItem(prev => prev.filter(u => u._id !== _id));
    } catch (error) {
      messageApi.error('Xóa tài khoản thất bại');
    }
  };
  const isActivePremium = (u: UserItem) =>
    !!u.premiumExpiresAt && dayjs(u.premiumExpiresAt).isAfter(dayjs());
  const handleGrantPremium = async () => {
    try {
      await grantPremium({ userId: grantUser._id, days: grantDays }).unwrap();
      messageApi.success('Đã cấp Premium');
      setGrantUser(null);
      refresh();
    } catch (error) {
      messageApi.error(error?.data?.message || 'Cấp Premium thất bại');
    }
  };
  const handleRevokePremium = async (userId: string) => {
    try {
      await revokePremium({ userId }).unwrap();
      messageApi.success('Đã thu hồi Premium');
      refresh();
    } catch (error) {
      messageApi.error(error?.data?.message || 'Thu hồi thất bại');
    }
  };
  const adminLevel = (u: UserItem) =>
    typeof u.role?.level === 'number' && u.role.level <= 2
      ? u.role.level
      : null;

  const confirmSetAdmin = (user: UserItem, isAdmin: boolean) =>
    setRoleChange({ user, isAdmin });

  const applyRoleChange = async () => {
    if (!roleChange) return;
    try {
      await setAdminRole({
        userId: roleChange.user._id,
        isAdmin: roleChange.isAdmin,
      }).unwrap();
      messageApi.success(
        roleChange.isAdmin ? 'Đã cấp quyền Admin' : 'Đã gỡ quyền Admin',
      );
      setRoleChange(null);
      refresh();
    } catch (error) {
      messageApi.error((error as any)?.data?.message || 'Đổi quyền thất bại');
    }
  };

  const actionItems = (record: UserItem): MenuProps['items'] => {
    const level = adminLevel(record);
    const isSelf = record._id === myId;
    const items: MenuProps['items'] = [
      {
        key: 'profile',
        label: 'Hồ sơ học tập',
        onClick: () => setProfileUserId(record._id),
      },
      {
        key: 'edit-info',
        label: 'Sửa thông tin',
        onClick: () => openEditUser(record),
      },
      {
        key: 'grant',
        label: 'Cấp Premium',
        onClick: () => setGrantUser(record),
      },
      {
        key: 'reset-password',
        label: 'Đặt mật khẩu mới',
        onClick: () => setResetTarget(record),
      },
      {
        key: 'mos',
        label: record.mosAccess ? 'Gia hạn app MOS' : 'Cấp quyền app MOS',
        onClick: () => setMosUser(record),
      },
    ];
    if (isActivePremium(record)) {
      items.push({
        key: 'revoke',
        label: 'Thu hồi Premium',
        onClick: () => handleRevokePremium(record._id),
      });
    }
    // Admin cấp cao (level 1) và chính mình: không đổi quyền ở đây.
    const locked = isSelf || (level !== null && level < 2);
    items.push(
      { type: 'divider' },
      level === null
        ? {
            key: 'make-admin',
            label: 'Cấp quyền Admin',
            disabled: isSelf,
            onClick: () => confirmSetAdmin(record, true),
          }
        : {
            key: 'remove-admin',
            label: 'Gỡ quyền Admin',
            disabled: locked,
            onClick: () => confirmSetAdmin(record, false),
          },
      { type: 'divider' },
      {
        key: 'delete',
        label: 'Xóa Tài khoản',
        danger: true,
        disabled: isSelf,
        onClick: () => {
          setInfoUser(record);
          setModalDeleteUser(true);
        },
      },
    );
    return items;
  };

  const columns: TableProps<UserItem>['columns'] = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string, record: UserItem) => {
        const level = adminLevel(record);
        return (
          <Space size={8}>
            <span>{name || record.email}</span>
            {level !== null && (
              <Tag
                color={level < 2 ? 'purple' : 'blue'}
                icon={<ControlOutlined size={12} hoverMorph={false} />}>
                {record.role?.name || 'Admin'}
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Loại',
      dataIndex: 'userType',
      key: 'userType',
      render: (v: 'student' | 'guest' | undefined, record: UserItem) =>
        adminLevel(record) !== null ? (
          <StateTag
            label="Quản trị viên"
            color="var(--color-vhu-primary)"
            bg="var(--color-surface-subtle)"
          />
        ) : v === 'guest' ? (
          <StateTag
            label="Khách"
            color="var(--color-warning)"
            bg="var(--color-warning-bg)"
          />
        ) : (
          <StateTag
            label="Sinh viên VHU"
            color="var(--color-info)"
            bg="var(--color-info-bg)"
          />
        ),
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      key: 'studentId',
      // Vừa đủ "211A290041"; dài hơn thì cắt bằng "...", rê chuột xem đầy đủ.
      render: (v?: string) => (
        <span
          title={v}
          style={{
            display: 'inline-block',
            maxWidth: '11ch',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'bottom',
          }}>
          {v}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Khoa',
      dataIndex: 'faculty',
      key: 'faculty',
    },
    {
      title: 'Ngành',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Premium',
      key: 'premium',
      render: (record: UserItem) =>
        isActivePremium(record) ? (
          <Text>đến {dayjs(record.premiumExpiresAt).format('DD/MM/YYYY')}</Text>
        ) : (
          <Text>Miễn phí</Text>
        ),
    },
    {
      title: 'Quyền app MOS',
      key: 'mosAccess',
      render: (record: UserItem) =>
        record.mosAccess ? (
          <Text>
            {record.mosExpiresAt
              ? `${mosExpired(record) ? 'Hết hạn' : 'Đã cấp, đến'} ${dayjs(record.mosExpiresAt).format('DD/MM/YYYY')}`
              : 'Đã cấp'}
          </Text>
        ) : (
          <Text>Chưa cấp</Text>
        ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => (
        <Text>{dayjs(value).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      key: 'action',
      width: 56,
      align: 'center',
      // Ghim bên phải: bảng rộng phải kéo ngang, nút thao tác luôn nằm trong tầm mắt.
      fixed: 'right',
      render: (record: UserItem) => (
        <Dropdown
          trigger={['click']}
          menu={{ items: actionItems(record) }}
          placement="bottomRight">
          <Button
            type="text"
            aria-label={`Thao tác với ${record.fullName || record.email}`}
            icon={<MoreOutlined size={20} hoverMorph={false} />}
          />
        </Dropdown>
      ),
    },
  ];
  const { data: activitySummary } = adminQuery.useGetUserActivitySummaryQuery();

  return (
    <View style={styles.container}>
      {contextHolder}
      <AdminGuide
        title="quản trị người dùng"
        steps={[
          'Tìm người dùng bằng ô tìm kiếm; lọc theo loại tài khoản (Quản trị viên / Sinh viên VHU / Khách).',
          'Bấm dấu ⋯ ở cuối dòng để mở menu: Hồ sơ học tập, Sửa thông tin, Cấp / Thu hồi Premium, Cấp / Gỡ quyền Admin, Xóa tài khoản.',
          'Sửa thông tin: đổi họ tên, mã lớp, khoa, ngành, số điện thoại rồi Lưu (email và mã sinh viên không đổi ở đây).',
          'Cấp Premium: nhập số ngày, số ngày được cộng dồn vào hạn hiện có.',
          'Đặt mật khẩu mới: chọn "Đặt mật khẩu mới" ở menu ⋯; hệ thống tự sinh mật khẩu và gửi về email học viên (không hiển thị cho admin). Chọn nhiều người để đặt hàng loạt.',
          'Cấp quyền app MOS: chọn "Cấp quyền app MOS" ở menu ⋯, nhập số ngày. Nếu đã cấp thì mục này thành "Gia hạn app MOS" và số ngày cộng dồn vào hạn còn lại; nếu đã hết hạn thì tính từ hôm nay. Có nút Thu hồi để khóa ngay.',
          'Tạo tài khoản mới: bấm "+ Tạo tài khoản" (hoặc dùng tab "Tạo / Nhập Người Dùng" để nhập hàng loạt bằng Excel).',
        ]}
        note="Tài khoản Admin có dấu hiệu riêng trong bảng. Xóa tài khoản không thể hoàn tác."
      />
      <StudentProfileDrawer
        userId={profileUserId}
        onClose={() => setProfileUserId(null)}
      />
      <View style={styles.statsGrid}>
        <StatCard
          icon="👥"
          label="Tổng người dùng"
          value={activitySummary?.totalUsers ?? currentData?.totalRecords}
          caption={`+${activitySummary?.newUsersLast7Days ?? 0} trong 7 ngày`}
          captionColor="#15803d"
        />
        <StatCard
          icon="⚡"
          label="Hoạt động hôm nay"
          value={activitySummary?.totalUsers ?? currentData?.totalRecords}
          caption={`+${activitySummary?.activeTodayPercent ?? 0}% tổng người dùng`}
          captionColor="var(--color-text-muted)"
        />
      </View>
      <TrafficChart />
      <View style={styles.controlBar}>
        <Search
          placeholder="Tìm kiếm theo tên, email, MSSV..."
          onSearch={v => {
            setSearchTerm(v);
            search(v);
          }}
          style={{ flex: '1 1 240px', minWidth: 200 }}
        />
        <Segmented
          aria-label="Lọc theo loại tài khoản"
          defaultValue="all"
          onChange={v => {
            const next = v === 'all' ? undefined : (v as string);
            setTypeFilter(next);
            filter(buildFilter(next, mosOnly));
          }}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'student', label: 'Sinh viên VHU' },
            { value: 'guest', label: 'Khách' },
          ]}
        />
        <Segmented
          aria-label="Lọc theo quyền dùng app MOS"
          defaultValue="all"
          onChange={v => {
            const next = v === 'mos';
            setMosOnly(next);
            filter(buildFilter(typeFilter, next));
          }}
          options={[
            { value: 'all', label: 'Mọi quyền app' },
            { value: 'mos', label: 'Đã cấp quyền app MOS' },
          ]}
        />
        <Button onClick={handleExport} loading={isExporting}>
          Xuất Excel
        </Button>
        <Button
          type="primary"
          style={{ borderRadius: 10, fontWeight: 600 }}
          onClick={() => setIsModalCreateUserOpen(true)}>
          + Tạo tài khoản
        </Button>
      </View>
      <UserBulkActions
        selectedIds={selectedKeys.map(String)}
        onClear={() => setSelectedKeys([])}
      />
      <div ref={tableWrapRef} style={{ minWidth: 0, maxWidth: '100%' }}>
        <View style={styles.tableCard}>
          <Table
            columns={columns}
            dataSource={listItem}
            rowKey={record => record._id}
            rowClassName={record =>
              adminLevel(record) !== null ? 'user-row-admin' : ''
            }
            rowSelection={{
              selectedRowKeys: selectedKeys,
              onChange: keys => setSelectedKeys(keys),
              // Giữ lựa chọn khi chuyển trang/tìm kiếm để chọn cả lớp nhiều trang.
              preserveSelectedRowKeys: true,
              getCheckboxProps: record =>
                ({ 'aria-label': `Chọn ${record.fullName}` }) as never,
            }}
            scroll={{ x: 'max-content' }}
            onChange={res => {
              fetchData({ pageNum: res.current, replace: true });
            }}
            pagination={{
              current: currentData?.pageNum,
              pageSize: 10,
              total: currentData?.totalRecords,
              showSizeChanger: false,
            }}
          />
        </View>
      </div>

      {/* Modal hiện thông tin user */}

      <Modal
        title="Tạo tài khoản"
        open={isModalCreateUserOpen}
        onCancel={() => setIsModalCreateUserOpen(false)}
        footer={null}
        width={760}>
        {/* Cùng một form với tab "Tạo Người Dùng" để hai nơi không lệch nhau. */}
        <CreateUserForm onCreated={() => setIsModalCreateUserOpen(false)} />
      </Modal>
      <Modal
        title={roleChange?.isAdmin ? 'Cấp quyền Admin?' : 'Gỡ quyền Admin?'}
        open={!!roleChange}
        okText={roleChange?.isAdmin ? 'Cấp quyền' : 'Gỡ quyền'}
        cancelText="Hủy"
        confirmLoading={isChangingRole}
        onCancel={() => setRoleChange(null)}
        onOk={applyRoleChange}>
        <Text>
          {roleChange?.isAdmin
            ? `${roleChange.user.fullName || roleChange.user.email} sẽ vào được khu Quản trị và không còn thấy giao diện học viên.`
            : `${roleChange?.user.fullName || roleChange?.user.email} sẽ trở lại là người dùng thường.`}
        </Text>
      </Modal>
      <Modal
        title="Đặt mật khẩu mới?"
        open={!!resetTarget}
        okText="Đặt và gửi email"
        cancelText="Hủy"
        confirmLoading={isResetting}
        onCancel={() => setResetTarget(null)}
        onOk={handleResetPassword}>
        <Text>
          {`Hệ thống tự sinh mật khẩu mới cho ${resetTarget?.fullName || resetTarget?.email} và gửi về ${resetTarget?.email}. Mật khẩu cũ mất hiệu lực, các thiết bị đang đăng nhập bị đăng xuất, và học viên được yêu cầu đổi mật khẩu khi đăng nhập web.`}
        </Text>
      </Modal>
      <Modal
        title={mosUser?.mosAccess ? 'Gia hạn app MOS' : 'Cấp quyền app MOS'}
        open={!!mosUser}
        onCancel={() => setMosUser(null)}
        okText={mosUser?.mosAccess ? 'Gia hạn' : 'Cấp quyền'}
        cancelText="Hủy"
        confirmLoading={isExtendingMos}
        onOk={handleExtendMos}>
        <p>
          Học viên <b>{mosUser?.fullName || mosUser?.email}</b>
          {mosUser?.mosAccess
            ? mosUser.mosExpiresAt
              ? mosExpired(mosUser)
                ? ` đã hết hạn từ ${dayjs(mosUser.mosExpiresAt).format('DD/MM/YYYY')}; hạn mới tính từ hôm nay.`
                : ` đang có quyền đến ${dayjs(mosUser.mosExpiresAt).format('DD/MM/YYYY')}; số ngày được cộng dồn vào hạn này.`
              : ' đang có quyền không giới hạn; hạn mới tính từ hôm nay.'
            : ' chưa có quyền dùng app MOS.'}
        </p>
        <label htmlFor="mos-days">Số ngày (1-3650)</label>
        <InputNumber
          id="mos-days"
          size="large"
          min={1}
          max={3650}
          style={{ width: '100%', marginTop: 8 }}
          value={mosDays}
          onChange={v => setMosDays(v ?? 30)}
        />
        {mosUser?.mosAccess ? (
          <Button
            danger
            style={{ marginTop: 12 }}
            loading={isRevokingMos}
            onClick={handleRevokeMos}>
            Thu hồi quyền ngay
          </Button>
        ) : null}
      </Modal>
      <Modal
        title="Cấp Premium"
        open={!!grantUser}
        onCancel={() => setGrantUser(null)}
        okText="Cấp Premium"
        cancelText="Hủy"
        confirmLoading={isGranting}
        onOk={handleGrantPremium}>
        <p>
          Cấp cho <b>{grantUser?.fullName || grantUser?.email}</b>. Số ngày sẽ
          được cộng dồn vào hạn Premium hiện có (nếu còn).
        </p>
        <label htmlFor="grant-days">Số ngày (1-3650)</label>
        <InputNumber
          id="grant-days"
          size="large"
          min={1}
          max={3650}
          style={{ width: '100%', marginTop: 8 }}
          value={grantDays}
          onChange={v => setGrantDays(v ?? 30)}
        />
      </Modal>
      <Modal
        title="Sửa thông tin người dùng"
        open={!!editUser}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isSavingInfo}
        onCancel={() => setEditUser(null)}
        onOk={handleSaveInfo}>
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item label="Mã lớp" name="class">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item label="Khoa" name="faculty">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item label="Ngành" name="major">
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phoneNumber">
            <Input maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận xóa tài khoản"
        open={isModalDeleteUser}
        onCancel={() => setModalDeleteUser(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalDeleteUser(false)}>
            Hủy
          </Button>,
          <Button
            key="delete"
            danger
            type="primary"
            onClick={() => {
              // Đóng modal TRƯỚC khi refresh() làm Table render lại toàn
              // bộ - trước đây đóng modal SAU khi await xong (đóng + Table
              // render lại cùng lúc) khiến modal antd kẹt lại vĩnh viễn,
              // vẫn hiện thông tin người dùng ĐÃ XÓA (dù xóa+refresh vẫn
              // chạy đúng ở backend) - xác nhận qua test trực tiếp nhiều
              // lần. Tách 2 việc ra để không còn đụng độ.
              const userId = infoUser._id;
              setModalDeleteUser(false);
              handleDeleteUser(userId);
            }}>
            Xóa tài khoản
          </Button>,
        ]}>
        <div style={{ textAlign: 'center' }}>
          <p>Bạn có chắc chắn muốn xóa người dùng sau không?</p>
          <Space
            direction="vertical"
            size="small"
            style={{ width: '100%', alignItems: 'center' }}>
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
              <Text>
                <b>Họ tên:</b> {infoUser?.fullName}
              </Text>
              <br />
              <Text>
                <b>MSSV:</b> {infoUser?.studentId}
              </Text>
              <br />
              <Text>
                <b>Email:</b> {infoUser?.email}
              </Text>
            </div>
          </Space>
        </div>
      </Modal>
    </View>
  );
};

export default UserManage;
