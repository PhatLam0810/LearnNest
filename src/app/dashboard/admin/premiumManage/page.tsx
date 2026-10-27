'use client';
import React, { useState } from 'react';
import { InputNumber, Select, Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { Text, View } from 'react-native-web';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import {
  useCreateActivationCodesMutation,
  useGetActivationCodesQuery,
} from '@/modules/premium/redux/RTKQuery';
import {
  ActivationCodeItem,
  PremiumPlanKey,
} from '@/modules/premium/redux/types';
import PendingOrders from './PendingOrders';
import RevenueReport from './RevenueReport';
import styles from './styles';

const PLAN_OPTIONS = [
  { value: 'month', label: 'Gói 1 tháng (30 ngày)' },
  { value: 'year', label: 'Gói 1 năm (365 ngày)' },
];

const PremiumManage = () => {
  const [plan, setPlan] = useState<PremiumPlanKey>('month');
  const [count, setCount] = useState(10);
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const { data, isLoading, isError, refetch } = useGetActivationCodesQuery();
  const [createCodes, { isLoading: creating }] =
    useCreateActivationCodesMutation();

  const handleCreate = async () => {
    try {
      setNewCodes(await createCodes({ plan, count }).unwrap());
    } catch (e) {
      messageApi.error(
        (e as { data?: { message?: string } })?.data?.message ||
          'Tạo mã thất bại',
      );
    }
  };

  const columns: TableProps<ActivationCodeItem>['columns'] = [
    { title: 'Mã', dataIndex: 'code', key: 'code' },
    {
      title: 'Gói',
      key: 'plan',
      render: (_, r) => (r.plan === 'year' ? '1 năm' : '1 tháng'),
    },
    {
      title: 'Tạo lúc',
      key: 'createdAt',
      render: (_, r) => dayjs(r.createdAt).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      key: 'used',
      render: (_, r) =>
        r.usedAt
          ? `Đã dùng ${dayjs(r.usedAt).format('DD/MM/YYYY')}`
          : 'Chưa dùng',
    },
  ];

  return (
    <View style={styles.container}>
      <View>
        <Text role="heading" aria-level={2} style={styles.pageTitle}>
          Premium
        </Text>
        <Text style={styles.subtitle}>
          Tạo mã kích hoạt để phát cho học viên. Cấp hoặc thu hồi Premium cho
          từng người ở tab Quản Trị Người Dùng.
        </Text>
      </View>

      <RevenueReport />

      <PendingOrders />

      <Text role="heading" aria-level={3} style={styles.sectionTitle}>
        Mã kích hoạt
      </Text>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text nativeID="pm-plan-label" style={styles.label}>
            Gói
          </Text>
          <Select
            aria-labelledby="pm-plan-label"
            size="large"
            style={{ width: 240 }}
            value={plan}
            options={PLAN_OPTIONS}
            onChange={setPlan}
          />
        </View>
        <View style={styles.field}>
          <Text nativeID="pm-count-label" style={styles.label}>
            Số lượng (1-200)
          </Text>
          <InputNumber
            aria-labelledby="pm-count-label"
            size="large"
            min={1}
            max={200}
            value={count}
            onChange={v => setCount(v ?? 1)}
          />
        </View>
        <AppButton type="primary" loading={creating} onClick={handleCreate}>
          Tạo mã
        </AppButton>
      </View>

      {newCodes.length > 0 && (
        <View style={styles.newCodes}>
          <Text style={styles.label}>
            Đã tạo {newCodes.length} mã (sao chép ngay để phát):
          </Text>
          <Text selectable style={styles.codeText}>
            {newCodes.join('   ')}
          </Text>
        </View>
      )}

      {isError ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Không tải được danh sách mã.</Text>
          <AppButton onClick={() => refetch()}>Thử lại</AppButton>
        </View>
      ) : (
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
                  Chưa có mã kích hoạt nào. Hãy tạo mã ở phía trên.
                </Text>
              </View>
            ),
          }}
        />
      )}
    </View>
  );
};

export default PremiumManage;
