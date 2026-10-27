'use client';
import React from 'react';
import { Popconfirm, Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { Text, View } from 'react-native-web';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import {
  useConfirmOrderMutation,
  useGetPendingOrdersQuery,
} from '@/modules/premium/redux/RTKQuery';
import { PremiumOrder } from '@/modules/premium/redux/types';
import styles from './styles';

const vnd = (n: number) => `${n.toLocaleString('vi-VN')} ₫`;
const buyer = (o: PremiumOrder) =>
  typeof o.userId === 'object' && o.userId
    ? o.userId.fullName || o.userId.email || '-'
    : '-';
const errMsg = (e: unknown, f: string) =>
  (e as { data?: { message?: string } })?.data?.message || f;

// Hệ thống tự cấp Premium khi SePay báo tiền về. Chỉ xác nhận tay ở đây khi
// admin đã thấy tiền trong sao kê mà webhook không về.
const PendingOrders: React.FC = () => {
  const pending = useGetPendingOrdersQuery();
  const [confirm] = useConfirmOrderMutation();

  const doConfirm = async (txnRef: string) => {
    try {
      await confirm({ txnRef }).unwrap();
      messageApi.success('Đã xác nhận và cấp Premium');
    } catch (e) {
      messageApi.error(errMsg(e, 'Xác nhận thất bại'));
    }
  };

  const columns: TableProps<PremiumOrder>['columns'] = [
    { title: 'Mã đơn', dataIndex: 'txnRef', key: 'txnRef' },
    { title: 'Người mua', key: 'buyer', render: (_, o) => buyer(o) },
    { title: 'Số tiền', key: 'amount', render: (_, o) => vnd(o.amount) },
    {
      title: 'Tạo lúc',
      key: 'createdAt',
      render: (_, o) => dayjs(o.createdAt).format('HH:mm DD/MM/YYYY'),
    },
    { title: 'Ghi chú', key: 'note', render: (_, o) => o.note || '-' },
    {
      title: '',
      key: 'action',
      render: (_, o) => (
        <Popconfirm
          title="Xác nhận đã nhận đủ tiền?"
          description="Chỉ bấm sau khi đã kiểm tra sao kê ngân hàng. Premium sẽ được cấp ngay."
          okText="Đã nhận tiền"
          cancelText="Hủy"
          onConfirm={() => doConfirm(o.txnRef)}>
          <AppButton size="small" style={{ width: 'auto' }}>
            Xác nhận đã nhận tiền
          </AppButton>
        </Popconfirm>
      ),
    },
  ];

  return (
    <View style={styles.section}>
      <Text role="heading" aria-level={3} style={styles.sectionTitle}>
        Đơn chuyển khoản chờ xác nhận
      </Text>
      <Text style={styles.subtitle}>
        Hệ thống tự cấp Premium khi SePay báo tiền về. Chỉ xác nhận tay khi bạn
        đã thấy tiền trong sao kê mà webhook không về.
      </Text>
      {pending.isError ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Không tải được dữ liệu.</Text>
          <AppButton onClick={() => pending.refetch()}>Thử lại</AppButton>
        </View>
      ) : (
        <Table
          rowKey="_id"
          loading={pending.isLoading}
          columns={columns}
          dataSource={pending.data}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          locale={{
            emptyText: (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Không có đơn nào đang chờ.</Text>
              </View>
            ),
          }}
        />
      )}
    </View>
  );
};

export default PendingOrders;
