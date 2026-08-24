'use client';
import React, { useState } from 'react';
import { Card, Radio, Spin } from 'antd';
import { View, Text } from 'react-native-web';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { adminQuery } from '~mdAdmin/redux';

type GroupBy = 'day' | 'week' | 'month' | 'year';
type ChartKind = 'bar' | 'line';

const GROUP_BY_LABEL: Record<GroupBy, string> = {
  day: 'Ngày',
  week: 'Tuần',
  month: 'Tháng',
  year: 'Năm',
};

const TrafficChart: React.FC = () => {
  const [groupBy, setGroupBy] = useState<GroupBy>('day');
  const [chartKind, setChartKind] = useState<ChartKind>('bar');

  const { data, isFetching } = adminQuery.useGetAnalyticsSummaryQuery({
    groupBy,
  });

  const rows = data || [];

  return (
    <Card
      style={{
        borderRadius: 12,
        border: '1px solid #eef1f6',
        boxShadow: '0 8px 20px rgba(29, 65, 138, 0.06)',
        marginBottom: 16,
        padding: 24,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}>
        <Text style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>
          Lượt truy cập website
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Radio.Group
            value={groupBy}
            onChange={e => setGroupBy(e.target.value)}
            optionType="button"
            buttonStyle="solid">
            {Object.entries(GROUP_BY_LABEL).map(([value, label]) => (
              <Radio.Button key={value} value={value}>
                {label}
              </Radio.Button>
            ))}
          </Radio.Group>
          <Radio.Group
            value={chartKind}
            onChange={e => setChartKind(e.target.value)}
            optionType="button"
            buttonStyle="solid">
            <Radio.Button value="bar">Cột</Radio.Button>
            <Radio.Button value="line">Đường</Radio.Button>
          </Radio.Group>
        </View>
      </View>

      <Spin spinning={isFetching}>
        <div style={{ width: '100%', height: 300 }}>
          {rows.length === 0 && !isFetching ? (
            <View
              style={{
                height: 300,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#9ca3af' }}>Chưa có dữ liệu truy cập</Text>
            </View>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'bar' ? (
                <BarChart
                  data={rows}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                  barCategoryGap="30%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#eef1f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickMargin={10}
                    axisLine={{ stroke: '#eef1f6' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickMargin={8}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    formatter={(value: number) => [value, 'Lượt truy cập']}
                    cursor={{ fill: 'rgba(29, 65, 138, 0.05)' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#1d418a"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              ) : (
                <LineChart
                  data={rows}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#eef1f6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickMargin={10}
                    axisLine={{ stroke: '#eef1f6' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickMargin={8}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    formatter={(value: number) => [value, 'Lượt truy cập']}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1d418a"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#88c1e9' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </Spin>
    </Card>
  );
};

export default TrafficChart;
