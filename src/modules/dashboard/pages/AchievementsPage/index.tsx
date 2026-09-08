'use client';
import React from 'react';
import { Progress, Spin } from 'antd';
import { useGetMyAchievementsQuery } from '~mdDashboard/redux';
import './styles.scss';

const AchievementsPage: React.FC = () => {
  const { data, isFetching } = useGetMyAchievementsQuery();

  if (isFetching && !data) {
    return (
      <div className="achv-center">
        <Spin />
      </div>
    );
  }

  const items = data?.items || [];
  const unlockedCount = items.filter(i => i.unlocked).length;

  return (
    <div className="achv-page">
      <h1 className="achv-heading">Thành tích</h1>
      <p className="achv-sub">
        Đã mở khoá {unlockedCount}/{items.length} huy hiệu.
      </p>

      <div className="achv-grid">
        {items.map(a => (
          <div
            key={a.code}
            className={`achv-card ${a.unlocked ? 'achv-card--on' : ''}`}>
            <div className="achv-icon">{a.icon}</div>
            <div className="achv-card-title">{a.title}</div>
            <div className="achv-card-desc">{a.description}</div>
            {a.unlocked ? (
              <div className="achv-badge-done">Đã đạt</div>
            ) : a.progress ? (
              <Progress
                percent={Math.round((a.progress[0] / a.progress[1]) * 100)}
                size="small"
                format={() => `${a.progress![0]}/${a.progress![1]}`}
              />
            ) : (
              <div className="achv-badge-locked">Chưa đạt</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
