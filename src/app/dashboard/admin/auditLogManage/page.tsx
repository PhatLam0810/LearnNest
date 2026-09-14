'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Table, TableProps, Modal, Tag } from 'antd';
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
};

// Dịch từng field trong `meta` sang tiếng Việt dễ hiểu — khớp đúng các key
// mà AUDIT_PICKERS (BE) tạo ra, xem audit.actions.ts. Field lạ (action mới
// thêm sau này quên cập nhật ở đây) vẫn hiện được, chỉ là giữ nguyên tên key.
const META_FIELD_LABEL: Record<string, string> = {
  email: 'Email',
  studentId: 'Mã số sinh viên',
  fullName: 'Họ và tên',
  roleLevel: 'Cấp quyền',
  roleId: 'Mã vai trò',
  // targetUserId chỉ hiện khi KHÔNG có targetUserName/Email đi kèm (user đã
  // bị xoá trước khi audit log được tạo - xem enrichTargetUser ở BE).
  targetUserId: 'Người dùng bị tác động (mã)',
  targetUserName: 'Người dùng bị tác động',
  targetUserEmail: 'Email người dùng bị tác động',
};

// targetUserId chỉ còn ý nghĩa hiển thị khi không resolve được thành tên -
// có tên rồi thì hiện mã ObjectId thô chỉ gây rối, không thêm thông tin.
const formatMetaEntries = (
  meta: Record<string, unknown> = {},
): [string, string][] => {
  const hasTargetName = 'targetUserName' in meta;
  return Object.entries(meta)
    .filter(([key, value]) => {
      if (value === undefined || value === null || value === '') return false;
      if (key === 'targetUserId' && hasTargetName) return false;
      return true;
    })
    .map(([key, value]) => [
      META_FIELD_LABEL[key] || key,
      typeof value === 'object' ? JSON.stringify(value) : String(value),
    ]);
};

const AuditLogManage: React.FC = () => {
  const { listItem, currentData, fetchData } = useAppPagination<AuditLogItem>({
    apiUrl: 'admin/audit-logs',
  });
  const [selected, setSelected] = useState<AuditLogItem | null>(null);

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
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (v: string) => <Text>{ACTION_LABEL[v] || v}</Text>,
    },
    {
      title: 'Đối tượng',
      key: 'targetId',
      render: (_: unknown, r: AuditLogItem) => {
        const name = r.meta?.targetUserName as string | undefined;
        const email = r.meta?.targetUserEmail as string | undefined;
        if (name) {
          return (
            <View>
              <Text>{name}</Text>
              {email && (
                <Text style={{ color: '#6b7280', fontSize: 12 }}>{email}</Text>
              )}
            </View>
          );
        }
        return <Text>{r.targetId || '—'}</Text>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <Tag color={v === 'success' ? 'green' : 'red'}>
          {v === 'success' ? 'Thành công' : 'Lỗi'}
        </Tag>
      ),
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      render: (v?: string) => <Text>{v || '—'}</Text>,
    },
  ];

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
        title="Chi tiết thao tác"
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        width={600}>
        {selected && (
          <View style={{ gap: 8 }}>
            <Text>
              <b>Thời gian:</b>{' '}
              {dayjs(selected.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </Text>
            <Text>
              <b>Người thực hiện:</b> {selected.actorName || '—'} (
              {selected.actorEmail || '—'})
            </Text>
            <Text>
              <b>Hành động:</b>{' '}
              {ACTION_LABEL[selected.action] || selected.action}
            </Text>
            <Text>
              <b>Đối tượng:</b>{' '}
              {(selected.meta?.targetUserName as string) ||
                selected.targetId ||
                '—'}
              {selected.meta?.targetUserEmail
                ? ` (${selected.meta.targetUserEmail})`
                : ''}
            </Text>
            <Text>
              <b>Trạng thái:</b>{' '}
              {selected.status === 'success' ? 'Thành công' : 'Lỗi'}
            </Text>
            {selected.errorMessage ? (
              <Text>
                <b>Lỗi:</b> {selected.errorMessage}
              </Text>
            ) : null}
            <Text>
              <b>IP:</b> {selected.ip || '—'}
            </Text>
            {formatMetaEntries(selected.meta).length > 0 && (
              <View style={{ marginTop: 4 }}>
                <Text>
                  <b>Chi tiết:</b>
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}>
                  {formatMetaEntries(selected.meta).map(([label, value], i) => (
                    <View
                      key={label}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '8px 12px',
                        backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff',
                        borderTop: i === 0 ? undefined : '1px solid #f0f0f0',
                      }}>
                      <Text style={{ width: 220, color: '#6b7280' }}>
                        {label}
                      </Text>
                      <Text style={{ flex: 1 }}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            <Text style={{ color: '#6b7280', fontSize: 12 }}>
              {selected.userAgent || ''}
            </Text>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default AuditLogManage;
