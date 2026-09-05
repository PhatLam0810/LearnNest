'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import styles from './styles';
import {
  Space,
  Table,
  TableProps,
  Modal,
  message,
  Button,
  Form,
  Input,
  Card,
} from 'antd';
import { useAppPagination } from '@hooks';
import { UserItem } from '~mdDashboard/types';
import { adminQuery } from '~mdAdmin/redux';
import dayjs from 'dayjs';
import { CreateUserParams } from '~mdAdmin/redux/RTKQuery/type';
import { authQuery } from '~mdAuth/redux/RTKQuery';
import TrafficChart from './components/TrafficChart';
const UserManage = () => {
  const { listItem, currentData, refresh, search, fetchData } =
    useAppPagination<UserItem>({
      apiUrl: 'user/getListUser',
    });

  const [isModalCreateUserOpen, setIsModalCreateUserOpen] = useState(false);
  const [createUserForm] = Form.useForm<CreateUserParams>();
  const [isModalDeleteUser, setModalDeleteUser] = useState(false);
  const [infoUser, setInfoUser] = useState<UserItem>(null);
  const [deleteAccount] = authQuery.useDeleteAccountMutation();
  const { Search } = Input;
  const [createUser, { isLoading: isLoadingCreateUser }] =
    adminQuery.useCreateUserMutation();
  const [sendEmails] = adminQuery.useSendImportEmailsMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const handleDeleteUser = async (_id: string) => {
    try {
      await deleteAccount({
        Userid: _id,
      });
      messageApi.success('Xóa tài khoản thành công');
      refresh();
    } catch (error) {
      messageApi.error('Xóa tài khoản thất bại');
    }
  };
  const handleCreateUser = async (value: any) => {
    try {
      const res = await createUser(value).unwrap();
      const payload: any = {
        accounts: [res],
      };
      await sendEmails(payload).unwrap();
      refresh();
      setIsModalCreateUserOpen(false);
      messageApi.success('Tạo user thành công thành công');
    } catch (error) {
      messageApi.error(error?.data?.message);
    }
  };
  const columns: TableProps<UserItem>['columns'] = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      key: 'studentId',
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => (
        <Text>{dayjs(value).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      key: 'action',
      render: (record: UserItem) => (
        <Space>
          <Button
            danger
            onClick={() => {
              setInfoUser(record);
              setModalDeleteUser(true);
            }}>
            Xóa Tài khoản
          </Button>
        </Space>
      ),
    },
  ];
  const { data: activitySummary } = adminQuery.useGetUserActivitySummaryQuery();

  return (
    <View style={styles.container}>
      {contextHolder}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 16,
        }}>
        <Card
          style={{
            flex: 1,
            minWidth: 220,
            borderRadius: 12,
            border: '1px solid #eef1f6',
            boxShadow: '0 8px 20px rgba(29, 65, 138, 0.06)',
            padding: 20,
          }}
          styles={{ body: { padding: 20 } }}>
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            Tổng người dùng
          </Text>
          <Text
            style={{
              display: 'block',
              fontSize: 28,
              fontWeight: 700,
              color: '#1c2536',
              marginTop: 4,
            }}>
            {activitySummary?.totalUsers ?? currentData?.totalRecords ?? 0}
          </Text>
          {!!activitySummary?.newUsersLast7Days && (
            <Text style={{ fontSize: 13, color: '#16a34a', marginTop: 4 }}>
              +{activitySummary.newUsersLast7Days} trong 7 ngày
            </Text>
          )}
        </Card>
        <Card
          style={{
            flex: 1,
            minWidth: 220,
            borderRadius: 12,
            border: '1px solid #eef1f6',
            boxShadow: '0 8px 20px rgba(29, 65, 138, 0.06)',
            padding: 20,
          }}
          styles={{ body: { padding: 20 } }}>
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            Hoạt động hôm nay
          </Text>
          <Text
            style={{
              display: 'block',
              fontSize: 28,
              fontWeight: 700,
              color: '#1c2536',
              marginTop: 4,
            }}>
            {activitySummary?.activeToday ?? 0}
          </Text>
          <Text style={{ fontSize: 13, color: '#8D8D8D', marginTop: 4 }}>
            {activitySummary?.activeTodayPercent ?? 0}% tổng người dùng
          </Text>
        </Card>
      </View>
      <TrafficChart />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
        <Search
          placeholder="Tìm kiếm"
          onSearch={search}
          style={{ width: '100%' }}
        />
        <Button type="primary" onClick={() => setIsModalCreateUserOpen(true)}>
          Tạo tài khoản
        </Button>
      </View>
      <Table
        columns={columns}
        dataSource={listItem}
        rowKey={record => record._id}
        scroll={{ x: 'max-content' }}
        onChange={res => {
          fetchData({ pageNum: res.current });
        }}
        pagination={{
          current: currentData?.pageNum,
          pageSize: currentData?.pageSize,
          total: currentData?.totalRecords,
        }}
      />

      {/* Modal hiện thông tin user */}

      <Modal
        title=" Tạo tài khoản"
        open={isModalCreateUserOpen}
        onCancel={() => setIsModalCreateUserOpen(false)}
        onOk={() => handleCreateUser(createUserForm.getFieldsValue())}
        confirmLoading={isLoadingCreateUser}>
        <Form form={createUserForm} layout="vertical">
          <Form.Item
            label="Họ và Tên"
            name="fullName"
            rules={[
              {
                required: true,
                message: 'Nhập họ và tên',
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Nhập email',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã sinh viên"
            name="studentId"
            rules={[
              {
                required: true,
                message: 'Nhập mã sinh viên',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã lớp"
            name="class"
            rules={[
              {
                required: true,
                message: 'Nhập mã lớp',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngành"
            name="major"
            rules={[
              {
                required: true,
                message: 'Nhập ngành',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Khoa"
            name="faculty"
            rules={[
              {
                required: true,
                message: 'Nhập khoa',
              },
            ]}>
            <Input />
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
            onClick={async () => {
              await handleDeleteUser(infoUser._id);
              setModalDeleteUser(false);
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
