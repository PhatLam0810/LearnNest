import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ScoreHistoryChartProps = {
  data: { label: string; score: number; name: string }[];
};

const ScoreHistoryChart: React.FC<ScoreHistoryChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
      <XAxis
        dataKey="label"
        tick={{ fontSize: 12, fill: '#6b7280' }}
        tickMargin={10}
        axisLine={{ stroke: '#eef1f6' }}
        tickLine={false}
      />
      <YAxis
        domain={[0, 10]}
        tick={{ fontSize: 12, fill: '#6b7280' }}
        tickMargin={8}
        axisLine={false}
        tickLine={false}
        width={28}
      />
      <Tooltip
        formatter={(value: number, _key, item) => [
          value,
          item?.payload?.name || 'Điểm',
        ]}
      />
      <Line
        type="monotone"
        dataKey="score"
        stroke="var(--color-vhu-primary)"
        strokeWidth={2}
        dot={{ r: 3 }}
        activeDot={{ r: 5 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default ScoreHistoryChart;
