'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import {
  Table,
  TableProps,
  Modal,
  Tag,
  Image,
  Space,
  Segmented,
  Button,
} from 'antd';
import dayjs from 'dayjs';
import { useAppPagination } from '@hooks';
import { messageApi } from '@hooks';
import api from '@services/api';
import styles from './styles';

type ReportUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
};

type ReportedComment = {
  _id: string;
  commentText: string;
  images?: string[];
  user?: ReportUser;
  createdAt: string;
} | null;

type CommentReportItem = {
  _id: string;
  commentId: ReportedComment;
  reportedBy: ReportUser | null;
  reason: 'spam' | 'inappropriate' | 'misinformation' | 'other';
  note?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
};

const REASON_LABEL: Record<string, string> = {
  spam: 'Spam / quảng cáo',
  inappropriate: 'Ngôn từ không phù hợp',
  misinformation: 'Nội dung sai lệch',
  other: 'Khác',
};

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  pending: { text: 'Chờ xử lý', color: 'orange' },
  resolved: { text: 'Đã xóa bình luận', color: 'red' },
  dismissed: { text: 'Đã bỏ qua', color: 'default' },
};

const userLabel = (u?: ReportUser | null) =>
  u
    ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.fullName || '—'
    : '—';

const CommentReportsManage: React.FC = () => {
  const [status, setStatus] = useState<'pending' | 'resolved' | 'dismissed'>(
    'pending',
  );
  const { listItem, currentData, fetchData, filter, refresh } =
    useAppPagination<CommentReportItem>({
      apiUrl: 'comments/admin/reports/list',
      params: { filter: { status: 'pending' } },
    });
  const [selected, setSelected] = useState<CommentReportItem | null>(null);
  const [resolving, setResolving] = useState(false);

  const changeStatus = (v: 'pending' | 'resolved' | 'dismissed') => {
    setStatus(v);
    filter({ status: v });
  };

  const resolve = async (action: 'delete' | 'dismiss') => {
    if (!selected) return;
    setResolving(true);
    try {
      await api.post(`/comments/admin/reports/${selected._id}/resolve`, {
        action,
      });
      messageApi.success(
        action === 'delete' ? 'Đã xóa bình luận' : 'Đã bỏ qua báo cáo',
      );
      setSelected(null);
      refresh();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không xử lý được');
    } finally {
      setResolving(false);
    }
  };

  const columns: TableProps<CommentReportItem>['columns'] = [
    {
      title: 'Người bị báo cáo',
      key: 'target',
      render: (_: unknown, r: CommentReportItem) => (
        <Text>{userLabel(r.commentId?.user)}</Text>
      ),
    },
    {
      title: 'Nội dung bình luận',
      key: 'content',
      render: (_: unknown, r: CommentReportItem) =>
        r.commentId ? (
          <View>
            <Text style={{ maxWidth: 280 }} numberOfLines={2}>
              {r.commentId.commentText}
            </Text>
            {!!r.commentId.images?.length && (
              <Text style={{ color: '#6b7280', fontSize: 12 }}>
                {r.commentId.images.length} ảnh đính kèm
              </Text>
            )}
          </View>
        ) : (
          <Text style={{ color: '#9ca3af' }}>Bình luận đã bị xóa</Text>
        ),
    },
    {
      title: 'Lý do báo cáo',
      dataIndex: 'reason',
      key: 'reason',
      render: (v: string) => <Tag>{REASON_LABEL[v] || v}</Tag>,
    },
    {
      title: 'Người báo cáo',
      key: 'reporter',
      render: (_: unknown, r: CommentReportItem) => (
        <Text>{userLabel(r.reportedBy)}</Text>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => <Text>{dayjs(v).format('DD/MM/YYYY HH:mm')}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <Tag color={STATUS_LABEL[v]?.color}>{STATUS_LABEL[v]?.text || v}</Tag>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <h1 style={{ margin: 0 }}>Báo cáo vi phạm</h1>
        <Segmented
          value={status}
          onChange={v => changeStatus(v as typeof status)}
          options={[
            { label: 'Chờ xử lý', value: 'pending' },
            { label: 'Đã xóa', value: 'resolved' },
            { label: 'Đã bỏ qua', value: 'dismissed' },
          ]}
        />
      </View>

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
        title="Chi tiết báo cáo vi phạm"
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={
          selected?.status === 'pending'
            ? [
                <Button
                  key="dismiss"
                  onClick={() => resolve('dismiss')}
                  loading={resolving}>
                  Bỏ qua báo cáo
                </Button>,
                <Button
                  key="delete"
                  danger
                  type="primary"
                  onClick={() => resolve('delete')}
                  loading={resolving}>
                  Xóa bình luận
                </Button>,
              ]
            : null
        }
        width={600}>
        {selected && (
          <View style={{ gap: 10 }}>
            <Text>
              <b>Người bị báo cáo:</b> {userLabel(selected.commentId?.user)}
            </Text>
            <Text>
              <b>Người báo cáo:</b> {userLabel(selected.reportedBy)} (
              {selected.reportedBy?.email || '—'})
            </Text>
            <Text>
              <b>Lý do:</b> {REASON_LABEL[selected.reason] || selected.reason}
            </Text>
            {selected.note && (
              <Text style={{ whiteSpace: 'pre-wrap' }}>
                <b>Ghi chú:</b> {selected.note}
              </Text>
            )}
            <Text>
              <b>Thời gian báo cáo:</b>{' '}
              {dayjs(selected.createdAt).format('DD/MM/YYYY HH:mm')}
            </Text>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: '#eef0f5',
                paddingTop: 10,
                marginTop: 4,
              }}>
              <Text style={{ fontWeight: '600', marginBottom: 6 }}>
                Nội dung bình luận bị báo cáo
              </Text>
              {selected.commentId ? (
                <>
                  <Text style={{ whiteSpace: 'pre-wrap' }}>
                    {selected.commentId.commentText}
                  </Text>
                  {!!selected.commentId.images?.length && (
                    <Space wrap style={{ marginTop: 8 }}>
                      {selected.commentId.images.map((url, idx) => (
                        <Image
                          key={idx}
                          src={url}
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover', borderRadius: 8 }}
                        />
                      ))}
                    </Space>
                  )}
                </>
              ) : (
                <Text style={{ color: '#9ca3af' }}>
                  Bình luận này đã bị xóa trước đó.
                </Text>
              )}
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default CommentReportsManage;
