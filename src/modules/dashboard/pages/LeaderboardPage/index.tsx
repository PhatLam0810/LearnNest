'use client';
import React from 'react';
import { Empty, Spin } from 'antd';
import { useGetLeaderboardQuery } from '~mdDashboard/redux';
import './styles.scss';

const medal = (rank: number) =>
  rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

const LeaderboardPage: React.FC = () => {
  const { data, isFetching } = useGetLeaderboardQuery(100);

  if (isFetching && !data) {
    return (
      <div className="lb-center">
        <Spin />
      </div>
    );
  }

  const top = data?.top || [];
  const me = data?.me;
  const meInTop = top.some(r => r.isMe);

  return (
    <div className="lb-page">
      <h1 className="lb-heading">Bảng xếp hạng</h1>
      <p className="lb-sub">
        Xếp hạng toàn hệ thống theo số bài thực hành đã đạt. Tên học viên khác
        được hiển thị viết tắt.
      </p>

      {me && (
        <div className="lb-me-card">
          <span className="lb-me-label">Hạng của bạn</span>
          <span className="lb-me-rank">
            {me.rank ? `#${me.rank}` : 'Chưa xếp hạng'}
          </span>
          <span className="lb-me-count">{me.passedCount} bài đạt</span>
        </div>
      )}

      {top.length === 0 ? (
        <Empty description="Chưa có ai đạt bài thực hành nào." />
      ) : (
        <div className="lb-list">
          {top.map(row => (
            <div
              key={row.rank}
              className={`lb-row ${row.isMe ? 'lb-row--me' : ''}`}>
              <span className="lb-rank">
                {medal(row.rank) || `#${row.rank}`}
              </span>
              <span className="lb-name">{row.name}</span>
              <span className="lb-count">{row.passedCount} bài</span>
            </div>
          ))}
          {!meInTop && me?.rank && (
            <div className="lb-row lb-row--me lb-row--detached">
              <span className="lb-rank">#{me.rank}</span>
              <span className="lb-name">Bạn</span>
              <span className="lb-count">{me.passedCount} bài</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
