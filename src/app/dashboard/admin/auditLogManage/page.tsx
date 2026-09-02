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
      dataIndex: 'targetId',
      key: 'targetId',
      render: (v?: string) => <Text>{v || '—'}</Text>,
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
              <b>Đối tượng:</b> {selected.targetId || '—'}
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
            <Text style={{ whiteSpace: 'pre-wrap' }}>
              <b>Chi tiết:</b>
              {'\n'}
              {JSON.stringify(selected.meta ?? {}, null, 2)}
            </Text>
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
