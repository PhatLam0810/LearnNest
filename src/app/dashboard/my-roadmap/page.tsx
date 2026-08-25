'use client';

import React from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useAppSelector } from '@redux';
import { useGetMyRoadmapQuery } from '~mdDashboard/redux';
import { LearningInsight } from '~mdDashboard/redux/RTKQuery/types';
import './styles.scss';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface InsightCardProps {
  insight: LearningInsight;
  isLatest: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, isLatest }) => {
  return (
    <div className={`roadmap-card ${isLatest ? 'roadmap-card--latest' : ''}`}>
      <div className="roadmap-card__header">
        {isLatest && <Tag color="green">Mới nhất</Tag>}
        <span className="roadmap-card__date">
          {dayjs(insight.generatedAt).fromNow()}
        </span>
      </div>

      <p className="roadmap-card__summary">{insight.summary}</p>

      {insight.roadmap?.length > 0 && (
        <ul className="roadmap-card__steps">
          {insight.roadmap.map((step, idx) => (
            <li key={idx}>
              <strong>{step.lessonName}</strong>: {step.action}
              {step.suggestedDeadline && (
                <span className="roadmap-card__deadline">
                  {' '}
                  (gợi ý: {step.suggestedDeadline})
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="roadmap-card__reminder">{insight.reminderBody}</p>
    </div>
  );
};

const MyRoadmapPage = () => {
  const userProfile = useAppSelector(
    state => state.authReducer.tokenInfo?.userProfile,
  );
  const userId = userProfile?._id || '';
  const { data: insights, isFetching } = useGetMyRoadmapQuery(userId, {
    skip: !userId,
  });

  if (isFetching) {
    return <div className="roadmap-empty-state">Đang tải dữ liệu...</div>;
  }

  if (!Array.isArray(insights) || insights.length === 0) {
    return (
      <div className="roadmap-empty-state">
        Chưa có lộ trình học tập nào được tạo. Bấm nút 🤖 ở góc màn hình để xin
        AI tư vấn ngay, hoặc chờ hệ thống tự động phân tích định kỳ.
      </div>
    );
  }

  return (
    <div className="my-roadmap-page">
      <h1 className="my-roadmap-heading">Lộ trình học tập của tôi</h1>
      <div className="my-roadmap-list">
        {insights.map((insight, idx) => (
          <InsightCard
            key={insight._id}
            insight={insight}
            isLatest={idx === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default MyRoadmapPage;
