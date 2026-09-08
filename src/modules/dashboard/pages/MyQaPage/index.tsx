'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Empty, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { messageApi } from '@hooks';
import { useGetMyQuestionsQuery } from '~mdDashboard/redux';
import './styles.scss';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const MyQaPage: React.FC = () => {
  const router = useRouter();
  const { data, isFetching } = useGetMyQuestionsQuery({ pageSize: 100 });

  const open = (link: string) => {
    if (link) router.push(link);
    else messageApi.info('Không xác định được vị trí câu hỏi này.');
  };

  if (isFetching && !data) {
    return (
      <div className="my-qa-center">
        <Spin />
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div className="my-qa-page">
      <h1 className="my-qa-heading">Hỏi đáp của tôi</h1>
      <p className="my-qa-sub">
        Các câu hỏi bạn đã đặt trong bài học, bài thực hành và đề thi thử.
      </p>

      {items.length === 0 ? (
        <Empty description="Bạn chưa đặt câu hỏi nào." />
      ) : (
        <div className="my-qa-list">
          {items.map(q => (
            <div
              key={q._id}
              className="my-qa-item"
              role="button"
              tabIndex={0}
              onClick={() => open(q.link)}>
              <div className="my-qa-item-head">
                {q.isAnswered ? (
                  <Tag color="success">Đã trả lời</Tag>
                ) : (
                  <Tag color="warning">Chờ trả lời</Tag>
                )}
                {q.contextTitle && (
                  <span className="my-qa-context">{q.contextTitle}</span>
                )}
                <span className="my-qa-time">
                  {dayjs(q.createdAt).fromNow()}
                </span>
              </div>
              <div className="my-qa-question">{q.commentText}</div>
              {q.replyCount > 0 && (
                <div className="my-qa-reply">
                  <span className="my-qa-reply-count">
                    {q.replyCount} trả lời
                  </span>
                  {q.latestReplyPreview && (
                    <span className="my-qa-reply-preview">
                      — {q.latestReplyPreview}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQaPage;
