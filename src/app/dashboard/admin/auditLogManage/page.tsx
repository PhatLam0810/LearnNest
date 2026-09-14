'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Table, TableProps, Modal, Tag, Button, message } from 'antd';
import { CloseOutlined, CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAppPagination } from '@hooks';
import styles from './styles';

type AuditLogItem = {
  _id: string;
  actorName?: string;
  actorEmail?: string;
  action: string;
  targetId?: string;
  status: 'success' | 'error';
  errorMessage?: string;
  meta?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: string;
};

const ACTION_LABEL: Record<string, string> = {
  'user.create': 'Tạo người dùng',
  'user.delete': 'Xóa người dùng',
  'user.role.grant': 'Cấp quyền admin',
  'user.role.revoke': 'Gỡ quyền admin',
  'user.import.bulk': 'Import hàng loạt người dùng',
  'practiceTask.update': 'Sửa đề thực hành',
  'practiceTask.delete': 'Xóa đề thực hành',
  'admin.email.remindBulk': 'Gửi email nhắc nhở hàng loạt',
  'admin.email.remindNotWatched': 'Gửi email nhắc xem video',
  'admin.email.remindNotPassedTask': 'Gửi email nhắc làm lại bài thực hành',
  'admin.email.remindNotPassedQuiz': 'Gửi email nhắc làm lại trắc nghiệm',
  'admin.email.sendPracticeClass': 'Gửi email thông báo lớp thực hành',
};

// Dịch từng field trong `meta` sang tiếng Việt dễ hiểu — khớp đúng các key
// mà AUDIT_PICKERS/AUDIT_RESULT_PICKERS (BE) tạo ra, xem audit.actions.ts.
// Field lạ (action mới thêm sau quên cập nhật ở đây) vẫn hiện được, chỉ là
// giữ nguyên tên key.
const META_FIELD_LABEL: Record<string, string> = {
  email: 'Email',
  studentId: 'Mã số sinh viên',
  fullName: 'Họ và tên',
  roleLevel: 'Cấp quyền',
  roleId: 'Mã vai trò',
  lessonId: 'Mã khóa học',
  subLessonId: 'Mã video',
  libraryId: 'Mã bài trắc nghiệm',
  classId: 'Mã lớp thực hành',
  totalEligible: 'Số người đủ điều kiện nhận',
  sent: 'Đã gửi',
  failed: 'Thất bại',
  targetUserId: 'Người dùng bị tác động (mã)',
  targetUserName: 'Người dùng bị tác động',
  targetUserEmail: 'Email người dùng bị tác động',
  targetTaskId: 'Đề thực hành (mã)',
  targetTaskTitle: 'Đề thực hành',
  targetTaskSubject: 'Môn',
};

// Field đã hiện riêng ở card "Đối tượng" trong modal — không lặp lại trong
// bảng "Chi tiết" bên dưới, tránh hiện trùng thông tin 2 lần.
const TARGET_SUMMARY_FIELDS = new Set([
  'targetUserId',
  'targetUserName',
  'targetUserEmail',
  'targetTaskId',
  'targetTaskTitle',
  'targetTaskSubject',
]);

const formatMetaEntries = (
  meta: Record<string, unknown> = {},
  excludeKeys: Set<string> = new Set(),
): [string, string][] =>
  Object.entries(meta)
    .filter(([key, value]) => {
      if (value === undefined || value === null || value === '') return false;
      return !excludeKeys.has(key);
    })
    .map(([key, value]) => [
      META_FIELD_LABEL[key] || key,
      typeof value === 'object' ? JSON.stringify(value) : String(value),
    ]);

// "Tạo người dùng · Nguyễn Văn A" thay vì chỉ "Tạo người dùng" trơ trọi —
// gộp label hành động với tên đối tượng nếu meta có sẵn (không gọi thêm
// API). Ưu tiên: người dùng bị tác động > đề thực hành > tên trong body gốc
// (VD user.create chưa có "target" vì user vừa tạo, nhưng vẫn có fullName).
const buildActionSummary = (item: AuditLogItem): string => {
  const label = ACTION_LABEL[item.action] || item.action;
  const target =
    (item.meta?.targetUserName as string) ||
    (item.meta?.targetTaskTitle as string) ||
    (item.meta?.fullName as string);
  return target ? `${label} · ${target}` : label;
};

const AuditLogManage: React.FC = () => {
  const { listItem, currentData, fetchData } = useAppPagination<AuditLogItem>({
    apiUrl: 'admin/audit-logs',
  });
  const [selected, setSelected] = useState<AuditLogItem | null>(null);

  const handleCopyJson = () => {
    if (!selected) return;
    navigator.clipboard
      .writeText(JSON.stringify(selected, null, 2))
      .then(() => message.success('Đã sao chép JSON'))
      .catch(() => message.error('Không sao chép được'));
  };

  const columns: TableProps<AuditLogItem>['columns'] = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => <Text>{dayjs(v).format('DD/MM/YYYY HH:mm')}</Text>,
    },
    {
      title: 'Người thực hiện',
      key: 'actor',
      render: (_: unknown, r: AuditLogItem) => (
        <View>
          <Text>{r.actorName || '—'}</Text>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>
            {r.actorEmail || ''}
          </Text>
        </View>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, r: AuditLogItem) => (
        <Text>{buildActionSummary(r)}</Text>
      ),
    },
    {
      title: 'Kết quả',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <Tag color={v === 'success' ? 'green' : 'red'}>
          {v === 'success' ? 'Thành công' : 'Lỗi'}
        </Tag>
      ),
    },
  ];

  const targetName =
    selected?.meta?.targetUserName || selected?.meta?.targetTaskTitle;
  const targetEmail = selected?.meta?.targetUserEmail;

  return (
    <View style={styles.container}>
      <h1 style={{ marginTop: 0, marginBottom: 16 }}>Nhật ký thao tác</h1>

      <Table
        columns={columns}
        dataSource={listItem}
        rowKey={record => record._id}
        scroll={{ x: 'max-content' }}
        onRow={record => ({
          onClick: () => setSelected(record),
          style: { cursor: 'pointer' },
        })}
        onChange={res => {
          fetchData({ pageNum: res.current });
        }}
        pagination={{
          current: currentData?.pageNum,
          pageSize: currentData?.pageSize,
          total: currentData?.totalRecords,
        }}
      />

      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        width={600}
        closeIcon={null}
        styles={{ body: { padding: 0 } }}>
        {selected && (
          <View>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTop}>
                <Text style={styles.modalTitle}>Chi tiết thao tác</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                  }}>
                  <Tag
                    color={selected.status === 'success' ? 'success' : 'error'}>
                    {selected.status === 'success' ? 'Thành công' : 'Lỗi'}
                  </Tag>
                  <Button
                    type="text"
                    icon={<CloseOutlined style={{ color: '#fff' }} />}
                    onClick={() => setSelected(null)}
                  />
                </View>
              </View>
              <Text style={styles.modalTimestamp}>
                {dayjs(selected.createdAt).format('DD/MM/YYYY HH:mm:ss')}
              </Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.sectionLabel}>HÀNH ĐỘNG</Text>
              <Text style={styles.actionHeadline}>
                {buildActionSummary(selected)}
              </Text>

              <View style={styles.cardsRow}>
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Người thực hiện</Text>
                  <Text style={styles.cardName}>
                    {selected.actorName || '—'}
                  </Text>
                  {!!selected.actorEmail && (
                    <Text style={styles.cardEmail}>{selected.actorEmail}</Text>
                  )}
                </View>
                {!!(targetName || selected.targetId) && (
                  <View style={styles.card}>
                    <Text style={styles.cardLabel}>Đối tượng</Text>
                    <Text style={styles.cardName}>
                      {(targetName as string) || selected.targetId}
                    </Text>
                    {!!targetEmail && (
                      <Text style={styles.cardEmail}>
                        {targetEmail as string}
                      </Text>
                    )}
                  </View>
                )}
              </View>

              {selected.errorMessage && (
                <View style={styles.errorBox}>
                  <Text style={{ color: '#cf1322' }}>
                    {selected.errorMessage}
                  </Text>
                </View>
              )}

              {(() => {
                const entries = formatMetaEntries(
                  selected.meta,
                  TARGET_SUMMARY_FIELDS,
                );
                if (!entries.length) return null;
                return (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.sectionLabel}>CHI TIẾT</Text>
                    <View style={styles.detailTable}>
                      {entries.map(([label, value], i) => (
                        <View
                          key={label}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '8px 12px',
                            backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff',
                            borderTop:
                              i === 0 ? undefined : '1px solid #f0f0f0',
                          }}>
                          <Text style={{ width: 220, color: '#6b7280' }}>
                            {label}
                          </Text>
                          <Text style={{ flex: 1 }}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })()}
            </View>

            <View style={styles.modalFooter}>
              <Text style={styles.userAgentText}>
                User agent: {selected.userAgent || '—'}
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                <Button icon={<CopyOutlined />} onClick={handleCopyJson}>
                  Sao chép JSON
                </Button>
                <Button type="primary" onClick={() => setSelected(null)}>
                  Đóng
                </Button>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default AuditLogManage;
