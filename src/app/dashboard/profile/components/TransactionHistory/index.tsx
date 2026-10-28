'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import {
  useCancelBankOrderMutation,
  useGetMyPremiumOrdersQuery,
} from '@/modules/premium/redux/RTKQuery';
import { PremiumOrder } from '@/modules/premium/redux/types';
import styles from './styles';

// Khớp ORDER_PENDING_MINUTES ở BE (premium.constants.ts) - chỉ để hiển thị,
// BE là nơi quyết định thật.
const ORDER_PENDING_MINUTES = 5;

const PLAN_LABEL: Record<string, string> = {
  month: 'Premium 1 tháng',
  year: 'Premium 1 năm',
  admin: 'Premium do quản trị cấp',
};
const METHOD_LABEL: Record<PremiumOrder['method'], string> = {
  bank: 'Chuyển khoản QR',
  vnpay: 'VNPay (cũ)',
  code: 'Mã kích hoạt',
  admin: 'Quản trị cấp',
};
const STATUS: Record<
  PremiumOrder['status'],
  { label: string; color: string; bg: string }
> = {
  paid: {
    label: 'Thành công',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
  },
  pending: {
    label: 'Chờ thanh toán',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
  },
  failed: {
    label: 'Thất bại',
    color: 'var(--color-error)',
    bg: 'var(--color-error-bg)',
  },
};

// Lịch sử đơn mua gói Premium (thay cho lịch sử mua từng bài bằng ETH cũ).
const TransactionHistory = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetMyPremiumOrdersQuery();
  const [cancelOrder, { isLoading: cancelling }] = useCancelBankOrderMutation();

  const pendingOrders = (data ?? []).filter(
    o => o.method === 'bank' && o.status === 'pending',
  );

  const handleCancel = async (txnRef: string) => {
    try {
      await cancelOrder({ txnRef }).unwrap();
      messageApi.success('Đã hủy đơn, bạn có thể mua lại ngay');
    } catch (e) {
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Không hủy được đơn, thử lại sau',
      );
    }
  };

  const columns: TableProps<PremiumOrder>['columns'] = [
    {
      title: 'Mã đơn',
      key: 'txnRef',
      render: (_, r) => (
        <Text style={styles.subTitle} numberOfLines={1}>
          {r.txnRef}
        </Text>
      ),
    },
    {
      title: 'Gói',
      key: 'plan',
      render: (_, r) => (
        <Text style={styles.subTitle}>{PLAN_LABEL[r.plan] || r.plan}</Text>
      ),
    },
    {
      title: 'Số tiền',
      key: 'amount',
      align: 'right',
      render: (_, r) => (
        <Text style={styles.subTitle}>
          {r.amount ? `${r.amount.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
        </Text>
      ),
    },
    {
      title: 'Hình thức',
      key: 'method',
      render: (_, r) => (
        <Text style={styles.subTitle}>{METHOD_LABEL[r.method]}</Text>
      ),
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (_, r) => (
        <Text style={styles.subTitle}>
          {dayjs(r.createdAt).format('HH:mm DD/MM/YYYY')}
        </Text>
      ),
    },
    {
      title: 'Hạn đến',
      key: 'premiumUntil',
      render: (_, r) => (
        <Text style={styles.subTitle}>
          {r.premiumUntil ? dayjs(r.premiumUntil).format('DD/MM/YYYY') : '-'}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, r) => {
        const s = STATUS[r.status];
        return (
          <View style={[styles.status, { backgroundColor: s.bg }]}>
            <Text style={[styles.statusText, { color: s.color }]}>
              {s.label}
            </Text>
          </View>
        );
      },
    },
  ];

  if (isError) {
    return (
      <View style={styles.errorPanel}>
        <Text style={styles.subTitle}>Không tải được lịch sử đơn Premium.</Text>
        <AppButton onClick={() => refetch()}>Thử lại</AppButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text role="heading" aria-level={2} style={styles.title}>
        Lịch sử đơn Premium
      </Text>
      {pendingOrders.length > 0 && (
        <View style={styles.pendingSection}>
          <Text role="heading" aria-level={3} style={styles.pendingTitle}>
            Đơn chờ thanh toán
          </Text>
          {pendingOrders.map(o => {
            const expired =
              Date.now() - new Date(o.createdAt).getTime() >
              ORDER_PENDING_MINUTES * 60 * 1000;
            return (
              <View key={o._id} style={styles.pendingRow}>
                <View style={styles.pendingInfo}>
                  <Text style={styles.subTitle}>
                    {PLAN_LABEL[o.plan] || o.plan} ·{' '}
                    {o.amount.toLocaleString('vi-VN')} ₫ · {o.txnRef}
                  </Text>
                  <Text style={styles.emptyText}>
                    {expired
                      ? 'Đã quá 5 phút - có thể mua đơn mới, hoặc hủy đơn này.'
                      : 'Đang chờ chuyển khoản. Muốn mua đơn khác thì hủy đơn này trước.'}
                  </Text>
                </View>
                <AppButton
                  size="small"
                  danger
                  loading={cancelling}
                  onClick={() => handleCancel(o.txnRef)}>
                  Hủy đơn
                </AppButton>
              </View>
            );
          })}
        </View>
      )}
      <Table
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        locale={{
          emptyText: (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Bạn chưa có đơn mua Premium nào.
              </Text>
              <AppButton
                type="primary"
                onClick={() => router.push('/dashboard/premium')}>
                Xem các gói Premium
              </AppButton>
            </View>
          ),
        }}
      />
    </View>
  );
};

export default TransactionHistory;
