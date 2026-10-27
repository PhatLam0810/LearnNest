'use client';
import React from 'react';
import { Table, TableProps } from 'antd';
import { Text, View } from 'react-native-web';
import AppButton from '@components/AppButton';
import StatCard from '../../home/_components/StatCard';
import { useGetRevenueReportQuery } from '@/modules/premium/redux/RTKQuery';
import styles from './styles';

const vnd = (n: number) => `${n.toLocaleString('vi-VN')} ₫`;
const PLAN_LABEL: Record<string, string> = { month: '1 tháng', year: '1 năm' };
const monthLabel = (m: string) => {
  const [y, mo] = m.split('-');
  return `Tháng ${mo}/${y}`;
};

type Row = { key: string; revenue: number; orders: number };

// Doanh thu đơn đã thanh toán tiền thật (bỏ qua mã kích hoạt/admin cấp).
const RevenueReport: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetRevenueReportQuery();

  const byMonthCols: TableProps<Row>['columns'] = [
    { title: 'Tháng', dataIndex: 'key', key: 'key', render: monthLabel },
    { title: 'Số đơn', dataIndex: 'orders', key: 'orders' },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: vnd,
    },
  ];
  const byPlanCols: TableProps<Row>['columns'] = [
    {
      title: 'Gói',
      dataIndex: 'key',
      key: 'key',
      render: (p: string) => PLAN_LABEL[p] || p,
    },
    { title: 'Số đơn', dataIndex: 'orders', key: 'orders' },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: vnd,
    },
  ];

  if (isError) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Không tải được báo cáo doanh thu.</Text>
        <AppButton onClick={() => refetch()}>Thử lại</AppButton>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text role="heading" aria-level={3} style={styles.sectionTitle}>
        Doanh thu
      </Text>
      <View style={styles.statsGrid}>
        <StatCard
          icon="💰"
          label="Tổng doanh thu"
          value={isLoading ? '…' : vnd(data?.totalRevenue ?? 0)}
          caption={`${data?.totalOrders ?? 0} đơn đã thanh toán`}
        />
        <StatCard
          icon="⭐"
          label="Đang là Premium"
          value={isLoading ? '…' : (data?.activePremium ?? 0)}
          caption="Tài khoản còn hạn (kể cả admin cấp, mã kích hoạt)"
        />
      </View>
      <Table
        rowKey="key"
        size="small"
        loading={isLoading}
        columns={byPlanCols}
        dataSource={(data?.byPlan ?? []).map(p => ({ key: p.plan, ...p }))}
        pagination={false}
        locale={{ emptyText: 'Chưa có doanh thu.' }}
      />
      <Table
        rowKey="key"
        size="small"
        loading={isLoading}
        columns={byMonthCols}
        dataSource={[...(data?.byMonth ?? [])]
          .reverse()
          .map(m => ({ key: m.month, revenue: m.revenue, orders: m.orders }))}
        pagination={{ pageSize: 6, showSizeChanger: false }}
        locale={{ emptyText: 'Chưa có doanh thu tháng nào.' }}
      />
    </View>
  );
};

export default RevenueReport;
