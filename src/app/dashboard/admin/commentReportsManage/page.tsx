'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Button, Image, Pagination, Segmented, Space } from 'antd';
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
  warnedAt?: string;
  createdAt: string;
};

const REASON_META: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  spam: { label: 'Spam', color: '#b45309', bg: '#fef3e2' },
  inappropriate: {
    label: 'Ngôn từ không phù hợp',
    color: '#c0392b',
    bg: '#fdeceb',
  },
  misinformation: {
    label: 'Nội dung sai lệch',
    color: '#7c3aed',
    bg: '#f3ecff',
  },
  other: { label: 'Khác', color: '#5b6478', bg: '#eef0f5' },
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
  const [actingId, setActingId] = useState<string | null>(null);

  const changeStatus = (v: 'pending' | 'resolved' | 'dismissed') => {
    setStatus(v);
    filter({ status: v });
  };

  const handleHide = async (item: CommentReportItem) => {
    setActingId(item._id);
    try {
      await api.post(`/comments/admin/reports/${item._id}/resolve`, {
        action: 'hide',
      });
      messageApi.success('Đã ẩn bình luận');
      refresh();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không xử lý được');
    } finally {
      setActingId(null);
    }
  };

  const handleDismiss = async (item: CommentReportItem) => {
    setActingId(item._id);
    try {
      await api.post(`/comments/admin/reports/${item._id}/resolve`, {
        action: 'dismiss',
      });
      messageApi.success('Đã bỏ qua báo cáo');
      refresh();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không xử lý được');
    } finally {
      setActingId(null);
    }
  };

  const handleWarn = async (item: CommentReportItem) => {
    setActingId(item._id);
    try {
      const res = await api.post(`/comments/admin/reports/${item._id}/warn`);
      messageApi.success(
        res.data?.data?.sent
          ? 'Đã gửi email cảnh báo cho người dùng.'
          : 'Đã ghi nhận nhưng gửi email thất bại.',
      );
      refresh();
    } catch (e: any) {
      messageApi.error(e?.response?.data?.message || 'Không gửi được cảnh báo');
    } finally {
      setActingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Báo Cáo Vi Phạm</Text>
        <Segmented
          value={status}
          onChange={v => changeStatus(v as typeof status)}
          options={[
            { label: 'Chờ xử lý', value: 'pending' },
            { label: 'Đã ẩn', value: 'resolved' },
            { label: 'Đã bỏ qua', value: 'dismissed' },
          ]}
        />
      </View>

      {!listItem.length && (
        <Text style={styles.emptyText}>Không có báo cáo nào.</Text>
      )}

      <View style={styles.list}>
        {listItem.map(item => {
          const meta = REASON_META[item.reason] || REASON_META.other;
          const isPending = item.status === 'pending';
          return (
            <View key={item._id} style={styles.card}>
              <View style={styles.headerLine}>
                <Text
                  style={[
                    styles.reasonTag,
                    { color: meta.color, backgroundColor: meta.bg },
                  ]}>
                  {meta.label}
                </Text>
                <Text style={styles.metaText}>
                  Báo cáo bởi {userLabel(item.reportedBy)} ·{' '}
                  {dayjs(item.createdAt).fromNow()}
                </Text>
              </View>

              <View style={styles.commentBox}>
                <Text style={styles.commentContext}>
                  Bình luận bởi {userLabel(item.commentId?.user)}
                </Text>
                {item.commentId ? (
                  <>
                    <Text style={styles.commentText}>
                      {item.commentId.commentText}
                    </Text>
                    {!!item.commentId.images?.length && (
                      <Space wrap style={{ marginTop: 4 }}>
                        {item.commentId.images.map((url, idx) => (
                          <Image
                            key={idx}
                            src={url}
                            width={64}
                            height={64}
                            style={{ objectFit: 'cover', borderRadius: 8 }}
                          />
                        ))}
                      </Space>
                    )}
                  </>
                ) : (
                  <Text style={styles.commentText}>
                    Bình luận này đã bị ẩn/xóa trước đó.
                  </Text>
                )}
              </View>

              {isPending && (
                <View style={styles.actionsRow}>
                  <Button
                    style={styles.hideButton}
                    loading={actingId === item._id}
                    disabled={!item.commentId}
                    onClick={() => handleHide(item)}>
                    Ẩn bình luận
                  </Button>
                  <Button
                    loading={actingId === item._id}
                    disabled={!!item.warnedAt || !item.commentId?.user}
                    onClick={() => handleWarn(item)}>
                    {item.warnedAt ? 'Đã cảnh báo' : 'Cảnh báo người dùng'}
                  </Button>
                  <Button
                    loading={actingId === item._id}
                    onClick={() => handleDismiss(item)}>
                    Bỏ qua
                  </Button>
                </View>
              )}
              {!isPending && item.warnedAt && (
                <Text style={styles.warnedText}>
                  Đã cảnh báo lúc{' '}
                  {dayjs(item.warnedAt).format('DD/MM/YYYY HH:mm')}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {!!currentData?.totalRecords && (
        <Pagination
          current={currentData?.pageNum}
          pageSize={currentData?.pageSize}
          total={currentData?.totalRecords}
          onChange={pageNum => fetchData({ pageNum })}
        />
      )}
    </View>
  );
};

export default CommentReportsManage;
