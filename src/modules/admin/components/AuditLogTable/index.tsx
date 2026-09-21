'use client';
import React from 'react';
import { Table, TableProps, Tag } from 'antd';
import { Text, View } from 'react-native-web';
import dayjs from 'dayjs';
import { AuditLogItem, buildActionSummary } from '../auditLogShared';
import './styles.scss';

interface AuditLogTableProps {
  listItem: AuditLogItem[];
  currentData?: { pageNum?: number; pageSize?: number; totalRecords?: number };
  onChangePage: (pageNum: number) => void;
  onRowClick: (record: AuditLogItem) => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({
  listItem,
  currentData,
  onChangePage,
  onRowClick,
}) => {
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
      render: (v: 'success' | 'error') => (
        <Tag
          style={{
            borderWidth: 0,
            margin: 0,
            fontWeight: 500,
            color: v === 'success' ? '#15803d' : '#c81e1e',
            background: v === 'success' ? '#f0fdf4' : '#fef2f2',
          }}>
          {v === 'success' ? 'Thành công' : 'Lỗi'}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      className="audit-log-table"
      columns={columns}
      dataSource={listItem}
      rowKey={record => record._id}
      scroll={{ x: 'max-content' }}
      onRow={record => ({
        onClick: () => onRowClick(record),
        style: { cursor: 'pointer' },
      })}
      onChange={res => onChangePage(res.current as number)}
      pagination={{
        current: currentData?.pageNum,
        pageSize: currentData?.pageSize,
        total: currentData?.totalRecords,
        showSizeChanger: false,
      }}
    />
  );
};

export default AuditLogTable;
