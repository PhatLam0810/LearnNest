'use client';
import React from 'react';
import { Text, View } from 'react-native-web';
import { Modal, Skeleton } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import {
  OverviewAtRiskLearner,
  OverviewDeadline,
} from '~mdAdmin/redux/RTKQuery/type';
import ThemedTable from '~mdAdmin/components/ThemedTable';
import { apiErrorMessage } from '~mdAdmin/components/practiceClassShared';
import { downloadBlob } from '~mdAdmin/components/submissionShared';
import styles from './styles';

const buttonStyle = { width: 'auto', height: 40 } as const;
const smallButton = { width: 'auto', height: 32 } as const;
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const StatBox = ({
  label,
  value,
  caption,
  tone = 'primary',
}: {
  label: string;
  value: string;
  caption: string;
  tone?: 'primary' | 'danger' | 'success';
}) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text
      style={{
        ...styles.statValue,
        ...(tone === 'danger' ? styles.toneDanger : null),
      }}>
      {value}
    </Text>
    <Text
      style={{
        ...styles.statCaption,
        ...(tone === 'success' ? styles.toneSuccess : null),
      }}>
      {caption}
    </Text>
  </View>
);

const OverviewManage: React.FC = () => {
  const { data, isFetching, isError, refetch } =
    adminQuery.useGetAdminOverviewQuery();
  const [remindLearner] = adminQuery.useRemindLearnerMutation();
  const [remindAssignment] = adminQuery.useRemindClassAssignmentMutation();
  const [exportAtRisk, { isLoading: isExporting }] =
    adminQuery.useExportAtRiskMutation();
  const [emailWeekly, { isLoading: isEmailing }] =
    adminQuery.useEmailWeeklySummaryMutation();

  const handleExport = async () => {
    try {
      downloadBlob(await exportAtRisk().unwrap(), 'nguy-co-bo-hoc.xlsx');
    } catch (err: unknown) {
      messageApi.error(apiErrorMessage(err, 'Xuất Excel thất bại'));
    }
  };

  const handleRemindLearner = async (row: OverviewAtRiskLearner) => {
    if (!row.lessonId) return;
    try {
      await remindLearner({
        lessonId: row.lessonId,
        userId: row.userId,
      }).unwrap();
      messageApi.success(`Đã nhắc ${row.fullName || row.email}`);
    } catch (err: unknown) {
      // BE từ chối người vừa được nhắc gần đây / còn đang học - báo đúng lý do.
      messageApi.warning(apiErrorMessage(err, 'Không nhắc được học viên này'));
    }
  };

  const handleRemindDeadline = (row: OverviewDeadline) => {
    Modal.confirm({
      title: 'Gửi email nhắc nộp bài?',
      content: `Gửi email và thông báo trong ứng dụng tới học viên lớp ${row.className} chưa nộp "${row.taskTitle}". Không thể thu hồi sau khi gửi.`,
      okText: 'Gửi nhắc',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await remindAssignment({
            classId: row.classId,
            assignmentId: row.assignmentId,
          }).unwrap();
          messageApi.success('Đã gửi nhắc');
        } catch (err: unknown) {
          messageApi.error(apiErrorMessage(err, 'Gửi nhắc thất bại'));
        }
      },
    });
  };

  const handleRemindAll = () => {
    const pending = (data?.deadlines ?? []).filter(d => d.submitted < d.total);
    Modal.confirm({
      title: 'Gửi email nhắc tất cả?',
      content: `Có ${pending.length} bài giao còn học viên chưa nộp. Hệ thống gửi lần lượt cho từng lớp. Không thể thu hồi sau khi gửi.`,
      okText: 'Gửi nhắc tất cả',
      cancelText: 'Hủy',
      onOk: async () => {
        let ok = 0;
        for (const d of pending) {
          try {
            await remindAssignment({
              classId: d.classId,
              assignmentId: d.assignmentId,
            }).unwrap();
            ok += 1;
          } catch {
            // Bỏ qua bài lỗi, đếm số thành công ở thông báo cuối.
          }
        }
        messageApi.success(`Đã gửi nhắc ${ok}/${pending.length} bài giao`);
      },
    });
  };

  const handleEmailWeekly = () => {
    Modal.confirm({
      title: 'Gửi tóm tắt tuần qua email?',
      content: 'Bản tóm tắt được gửi tới email của tài khoản bạn đang dùng.',
      okText: 'Gửi',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await emailWeekly().unwrap();
          messageApi.success('Đã gửi tóm tắt tuần');
        } catch (err: unknown) {
          messageApi.error(apiErrorMessage(err, 'Gửi tóm tắt thất bại'));
        }
      },
    });
  };

  if (isFetching && !data) {
    return (
      <View style={styles.wrap}>
        <View style={styles.statRow}>
          {[0, 1, 2, 3].map(k => (
            <View key={k} style={styles.statCard}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </View>
      </View>
    );
  }
  if (isError || !data) {
    return (
      <View style={{ ...styles.centerState, ...styles.errorState }}>
        <Text style={styles.errorText}>Không tải được số liệu tổng quan.</Text>
        <AppButton style={buttonStyle} onClick={() => refetch()}>
          Thử lại
        </AppButton>
      </View>
    );
  }

  const { signups, completion, weekly } = data;
  const maxDay = Math.max(1, ...signups.days.map(d => d.student + d.guest));
  const delta = completion.deltaVsLastMonth;

  const atRiskColumns: TableProps<OverviewAtRiskLearner>['columns'] = [
    {
      title: 'Học viên',
      key: 'name',
      render: (_: unknown, r) => (
        <Text style={styles.strong}>{r.fullName || r.email}</Text>
      ),
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
      render: (v: string) => v || '—',
    },
    {
      title: 'Học lần cuối',
      key: 'last',
      render: (_: unknown, r) => (
        <Text style={styles.dangerText}>
          {r.lastActiveAt
            ? `${r.daysInactive} ngày trước`
            : `Chưa học (${r.daysInactive} ngày)`}
        </Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_: unknown, r) => (
        <button
          type="button"
          style={styles.linkButton as React.CSSProperties}
          disabled={!r.lessonId}
          onClick={() => handleRemindLearner(r)}>
          Nhắc nhở
        </button>
      ),
    },
  ];

  const deadlineColumns: TableProps<OverviewDeadline>['columns'] = [
    { title: 'Bài giao', dataIndex: 'taskTitle', key: 'taskTitle' },
    { title: 'Lớp', dataIndex: 'className', key: 'className' },
    {
      title: 'Hạn nộp',
      key: 'due',
      render: (_: unknown, r) => dayjs(r.dueDate).format('DD/MM/YYYY'),
    },
    {
      title: 'Đã nộp',
      key: 'submitted',
      render: (_: unknown, r) => `${r.submitted}/${r.total}`,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_: unknown, r) => (
        <button
          type="button"
          style={styles.linkButton as React.CSSProperties}
          disabled={r.submitted >= r.total}
          onClick={() => handleRemindDeadline(r)}>
          Gửi email nhắc
        </button>
      ),
    },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.statRow}>
        <StatBox
          label="Đăng ký mới (7 ngày)"
          value={String(signups.total)}
          caption={`${signups.student} sinh viên VHU · ${signups.guest} khách`}
        />
        <StatBox
          label="Tỉ lệ hoàn thành khóa TB"
          value={`${String(completion.rate).replace('.', ',')}%`}
          caption={
            delta === null
              ? 'Chưa đủ dữ liệu so sánh'
              : `${delta >= 0 ? '+' : ''}${String(delta).replace('.', ',')}% so với tháng trước`
          }
          tone={delta !== null && delta >= 0 ? 'success' : 'primary'}
        />
        <StatBox
          label="Có nguy cơ bỏ học"
          value={String(data.atRiskCount)}
          caption="chưa học >10 ngày"
          tone="danger"
        />
        <StatBox
          label="Hạn nộp trong 7 ngày"
          value={String(data.dueSoon)}
          caption="bài thực hành + quiz"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Đăng ký mới theo ngày</Text>
        <View style={styles.chart}>
          {signups.days.map(d => {
            const total = d.student + d.guest;
            return (
              <View key={d.date} style={styles.chartCol}>
                <View style={styles.chartBarWrap}>
                  <View
                    style={{
                      ...styles.chartBar,
                      height: `${(total / maxDay) * 100}%`,
                    }}
                    {...({ role: 'img' } as Record<string, string>)}
                    accessibilityLabel={`${dayjs(d.date).format('DD/MM')}: ${d.student} sinh viên, ${d.guest} khách`}>
                    <View style={{ ...styles.barGuest, flexGrow: d.guest }} />
                    <View
                      style={{ ...styles.barStudent, flexGrow: d.student }}
                    />
                  </View>
                </View>
                <Text style={styles.chartValue}>{total}</Text>
                <Text style={styles.chartLabel}>
                  {WEEKDAYS[dayjs(d.date).day()]}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={{ ...styles.dot, ...styles.barStudent }} />
            <Text style={styles.caption}>Sinh viên VHU</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={{ ...styles.dot, ...styles.barGuest }} />
            <Text style={styles.caption}>Khách</Text>
          </View>
        </View>
      </View>

      <View style={styles.twoCol}>
        <View style={{ ...styles.card, ...styles.colWide }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Học viên có nguy cơ bỏ học</Text>
            <AppButton
              style={smallButton}
              loading={isExporting}
              onClick={handleExport}>
              Xuất Excel
            </AppButton>
          </View>
          {data.atRisk.length ? (
            <ThemedTable
              rowKey="userId"
              columns={atRiskColumns}
              dataSource={data.atRisk}
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          ) : (
            <Text style={styles.emptyText}>
              Không có học viên nào chưa học quá 10 ngày.
            </Text>
          )}
        </View>
        <View style={{ ...styles.card, ...styles.colNarrow }}>
          <Text style={styles.cardTitle}>Tóm tắt tuần này</Text>
          {[
            ['Học viên hoạt động', weekly.activeLearners],
            ['Bài nộp mới', weekly.newSubmissions],
            ['Lớp học mới', weekly.newClasses],
            ['Phản hồi cần xử lý', weekly.pendingFeedback],
          ].map(([label, value]) => (
            <View key={label as string} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{label}</Text>
              <Text style={styles.strong}>{value}</Text>
            </View>
          ))}
          <AppButton
            type="primary"
            style={{ ...buttonStyle, width: '100%' }}
            loading={isEmailing}
            onClick={handleEmailWeekly}>
            Gửi tóm tắt qua email
          </AppButton>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, minWidth: 220 }}>
            <Text style={styles.cardTitle}>Lịch hạn nộp</Text>
            <Text style={styles.caption}>
              Bài thực hành sắp đến hạn theo lớp (14 ngày tới)
            </Text>
          </View>
          <AppButton
            style={buttonStyle}
            disabled={!data.deadlines.some(d => d.submitted < d.total)}
            onClick={handleRemindAll}>
            Gửi email nhắc tất cả
          </AppButton>
        </View>
        {data.deadlines.length ? (
          <ThemedTable
            rowKey="assignmentId"
            columns={deadlineColumns}
            dataSource={data.deadlines}
            pagination={false}
          />
        ) : (
          <Text style={styles.emptyText}>
            Không có bài giao nào đến hạn trong 14 ngày tới.
          </Text>
        )}
      </View>
    </View>
  );
};

export default OverviewManage;
