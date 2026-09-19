'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import { Image, Pagination, Segmented, Skeleton } from 'antd';
import Link from 'next/link';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';
import { messageApi } from '@hooks';
import { adminQuery } from '~mdAdmin/redux';
import {
  CommentReportItem,
  CommentReportStatus,
  CommentReportUser,
} from '~mdAdmin/redux/RTKQuery/type';
import styles from './styles';

const REASON_LABEL: Record<string, string> = {
  spam: 'Spam',
  inappropriate: 'Ngôn từ không phù hợp',
  misinformation: 'Nội dung sai lệch',
  other: 'Khác',
};

const STATUS_OPTIONS = [
  { label: 'Chờ xử lý', value: 'pending' },
  { label: 'Đã ẩn', value: 'resolved' },
  { label: 'Đã bỏ qua', value: 'dismissed' },
];

const EMPTY_COPY: Record<CommentReportStatus, string> = {
  pending: 'Không có báo cáo nào đang chờ xử lý.',
  resolved: 'Chưa có bình luận nào bị ẩn.',
  dismissed: 'Chưa có báo cáo nào bị bỏ qua.',
};

const buttonStyle = { width: 'auto', height: 40 } as const;

const userLabel = (u?: CommentReportUser | null) =>
  u
    ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.fullName || '—'
    : '—';

const errorMessage = (e: unknown, fallback: string) =>
  (e as { data?: { message?: string } })?.data?.message || fallback;

const CommentReportsManage: React.FC = () => {
  const [status, setStatus] = useState<CommentReportStatus>('pending');
  const [pageNum, setPageNum] = useState(1);
  const [actingId, setActingId] = useState<string | null>(null);

  const { data, isFetching, isError, refetch } =
    adminQuery.useGetCommentReportsQuery({ status, pageNum });
  const [resolveReport] = adminQuery.useResolveCommentReportMutation();
  const [warnUser] = adminQuery.useWarnCommentUserMutation();

  const items = data?.items ?? [];

  const changeStatus = (v: CommentReportStatus) => {
    setStatus(v);
    setPageNum(1);
  };

  const act = async (
    item: CommentReportItem,
    run: () => Promise<void>,
    fallback: string,
  ) => {
    setActingId(item._id);
    try {
      await run();
    } catch (e: unknown) {
      messageApi.error(errorMessage(e, fallback));
    } finally {
      setActingId(null);
    }
  };

  const handleHide = (item: CommentReportItem) =>
    act(
      item,
      async () => {
        await resolveReport({ reportId: item._id, action: 'hide' }).unwrap();
        messageApi.success('Đã ẩn bình luận');
      },
      'Không xử lý được',
    );

  const handleDismiss = (item: CommentReportItem) =>
    act(
      item,
      async () => {
        await resolveReport({ reportId: item._id, action: 'dismiss' }).unwrap();
        messageApi.success('Đã bỏ qua báo cáo');
      },
      'Không xử lý được',
    );

  const handleWarn = (item: CommentReportItem) =>
    act(
      item,
      async () => {
        const res = await warnUser(item._id).unwrap();
        messageApi.success(
          res?.sent
            ? 'Đã gửi email cảnh báo cho người dùng.'
            : 'Đã ghi nhận nhưng gửi email thất bại.',
        );
      },
      'Không gửi được cảnh báo',
    );

  const renderCard = (item: CommentReportItem) => {
    const isPending = item.status === 'pending';
    const busy = actingId === item._id;
    const comment = item.commentId;
    return (
      <View key={item._id} style={styles.card}>
        <View style={styles.headerLine}>
          <Text style={styles.reasonTag}>
            {REASON_LABEL[item.reason] || REASON_LABEL.other}
          </Text>
          <Text style={styles.metaText}>
            {`Báo cáo bởi ${userLabel(item.reportedBy)} · ${dayjs(item.createdAt).fromNow()}`}
          </Text>
        </View>

        <View style={styles.quoteBlock}>
          <Text style={styles.quoteLabel}>
            {`Bình luận bởi ${userLabel(comment?.user)}`}
          </Text>
          {comment ? (
            <>
              <Text style={styles.quoteText}>{comment.commentText}</Text>
              {!!comment.images?.length && (
                <View style={styles.imagesRow}>
                  {comment.images.map(url => (
                    <Image
                      key={url}
                      src={url}
                      width={64}
                      height={64}
                      alt="Ảnh đính kèm bình luận"
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  ))}
                </View>
              )}
              {!!comment.contextTitle && !!comment.link && (
                <Text style={styles.metaText}>
                  {'Bài học: '}
                  <Link href={comment.link}>{comment.contextTitle}</Link>
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.quoteText}>
              Bình luận này đã bị ẩn/xóa trước đó.
            </Text>
          )}
        </View>

        {!!item.note && (
          <Text style={styles.noteText}>{`Ghi chú: ${item.note}`}</Text>
        )}

        {isPending && (
          <View style={styles.footer}>
            <button
              type="button"
              style={styles.hideButton as React.CSSProperties}
              disabled={busy || !comment}
              onClick={() => handleHide(item)}>
              Ẩn bình luận
            </button>
            <AppButton
              style={buttonStyle}
              loading={busy}
              disabled={busy || !!item.warnedAt || !comment?.user}
              onClick={() => handleWarn(item)}>
              {item.warnedAt ? 'Đã cảnh báo' : 'Cảnh báo người dùng'}
            </AppButton>
            <AppButton
              type="text"
              style={buttonStyle}
              disabled={busy}
              onClick={() => handleDismiss(item)}>
              Bỏ qua
            </AppButton>
          </View>
        )}
        {!isPending && !!item.warnedAt && (
          <Text style={styles.warnedText}>
            {`Đã cảnh báo lúc ${dayjs(item.warnedAt).format('HH:mm DD/MM/YYYY')}`}
          </Text>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (isFetching && !data) {
      return (
        <View style={styles.list}>
          {[0, 1, 2].map(k => (
            <View key={k} style={styles.skeletonCard}>
              <Skeleton active paragraph={{ rows: 3 }} />
            </View>
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <View style={{ ...styles.stateWrap, ...styles.errorWrap }}>
          <Text style={styles.errorText}>Không tải được báo cáo vi phạm.</Text>
          <AppButton style={buttonStyle} onClick={() => refetch()}>
            Thử lại
          </AppButton>
        </View>
      );
    }
    if (!items.length) {
      return (
        <View style={styles.stateWrap}>
          <Text style={styles.emptyText}>{EMPTY_COPY[status]}</Text>
          {status === 'pending' && (
            <AppButton
              style={buttonStyle}
              onClick={() => changeStatus('resolved')}>
              Xem báo cáo đã xử lý
            </AppButton>
          )}
        </View>
      );
    }
    return <View style={styles.list}>{items.map(renderCard)}</View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Báo Cáo Vi Phạm</Text>
        <Segmented
          value={status}
          onChange={v => changeStatus(v as CommentReportStatus)}
          options={STATUS_OPTIONS}
        />
      </View>

      {renderContent()}

      {!!data?.totalRecords && data.totalRecords > data.pageSize && (
        <View style={styles.paginationRow}>
          <Pagination
            current={data.pageNum}
            pageSize={data.pageSize}
            total={data.totalRecords}
            showSizeChanger={false}
            onChange={setPageNum}
          />
        </View>
      )}
    </View>
  );
};

export default CommentReportsManage;
