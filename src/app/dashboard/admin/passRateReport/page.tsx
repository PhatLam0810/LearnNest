'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Table, TableProps, Tag, Statistic, Card } from 'antd';
import { dashboardQuery } from '~mdDashboard/redux';
import { PassRateReportRow } from '~mdDashboard/redux/RTKQuery/types';
import './styles.scss';

// Báo cáo tỉ lệ đạt/chưa đạt theo TỪNG bài (trắc nghiệm + thực hành), sắp
// theo tỉ lệ đạt TĂNG DẦN (bài "kẹt" học viên nhiều nhất lên đầu) - giúp
// admin thấy nội dung nào cần xem lại độ khó sau khi ngưỡng đạt được siết
// lên 80% cho cả 2 loại bài. Xem LessonService.getPassRateReport (BE).
const PassRateReport: React.FC = () => {
  const { data, isFetching } = dashboardQuery.useGetPassRateReportQuery();

  const passRateColor = (rate: number) => {
    if (rate >= 70) return '#16a34a';
    if (rate >= 40) return '#d97706';
    return '#dc2626';
  };

  const columns: TableProps<PassRateReportRow>['columns'] = [
    {
      title: 'Tên bài',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, r: PassRateReportRow) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14 }}>{r.name}</Text>
          <Tag color={r.type === 'practice' ? 'orange' : 'blue'}>
            {r.type === 'practice' ? 'Thực hành' : 'Trắc nghiệm'}
          </Tag>
        </View>
      ),
    },
    {
      title: 'Lượt làm',
      dataIndex: 'attempts',
      key: 'attempts',
      width: 110,
      sorter: (a, b) => a.attempts - b.attempts,
    },
    {
      title: 'Lượt đạt',
      dataIndex: 'passCount',
      key: 'passCount',
      width: 110,
    },
    {
      title: 'Tỉ lệ đạt',
      dataIndex: 'passRate',
      key: 'passRate',
      width: 130,
      sorter: (a, b) => a.passRate - b.passRate,
      defaultSortOrder: 'ascend',
      render: (v: number) => (
        <Text style={{ fontWeight: 700, color: passRateColor(v) }}>
          {v.toFixed(1)}%
        </Text>
      ),
    },
    {
      title: 'Điểm TB',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: 110,
      render: (v: number) => <Text>{v.toFixed(1)}/10</Text>,
    },
  ];

  return (
    <div className="pass-rate-report-page">
      <View style={{ padding: 8, gap: 16 }}>
        <div className="pass-rate-report-summary-row">
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 16,
            }}>
            <Card
              className="pass-rate-report-summary-card"
              style={{ minWidth: 200 }}>
              <Statistic
                title="Tổng lượt làm bài"
                value={data?.summary.totalAttempts ?? 0}
              />
            </Card>
            <Card
              className="pass-rate-report-summary-card"
              style={{ minWidth: 200 }}>
              <Statistic
                title="Tỉ lệ đạt chung"
                value={data?.summary.overallPassRate ?? 0}
                suffix="%"
              />
            </Card>
            <Card
              className="pass-rate-report-summary-card"
              style={{ minWidth: 200 }}>
              <Statistic
                title="Ngưỡng đạt hiện tại"
                value={data?.summary.currentThresholdPct ?? 80}
                suffix="%"
              />
            </Card>
          </View>
        </div>
        <Text style={{ fontSize: 13, color: '#8D8D8D' }}>
          Tỉ lệ đạt tính trên toàn bộ lịch sử - bài trắc nghiệm làm trước khi
          đổi ngưỡng (2/3 số câu) vẫn giữ nguyên kết quả đã chấm lúc đó, không
          tính lại theo ngưỡng 80% mới.
        </Text>
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={data?.rows}
          rowKey={r => `${r.type}-${r.id}`}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 20, showSizeChanger: true }}
        />
      </View>
    </div>
  );
};

export default PassRateReport;
