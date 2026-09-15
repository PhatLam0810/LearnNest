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

type ScoreTrendChartProps = {
  data: { idx: number; label: string; score: number }[];
};

const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={240}>
    <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: -16 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
      <XAxis dataKey="label" fontSize={12} />
      <YAxis domain={[0, 10]} fontSize={12} />
      <Tooltip formatter={(v: number) => [`${v}/10`, 'Điểm']} />
      <Line
        type="monotone"
        dataKey="score"
        stroke="#1d418a"
        strokeWidth={2}
        dot={{ r: 3 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default ScoreTrendChart;
