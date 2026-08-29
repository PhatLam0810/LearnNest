'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Empty, Spin, Tabs, Tag } from 'antd';
import { dashboardQuery } from '~mdDashboard/redux';
import { PracticeSubject } from '~mdDashboard/types/practice';
import './styles.scss';

const SUBJECT_TABS: {
  key: string;
  label: string;
  subject?: PracticeSubject;
}[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'excel', label: 'Excel', subject: 'Excel' },
  { key: 'word', label: 'Word', subject: 'Word' },
];

const PracticeListPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const subject = SUBJECT_TABS.find(t => t.key === activeTab)?.subject;

  const { data, isFetching } = dashboardQuery.useGetPracticeTasksStudentQuery(
    subject ? { subject } : undefined,
  );

  return (
    <div className="practice-list-page">
      <h1 className="practice-list-heading">Thực Hành MOS</h1>
      <p className="practice-list-subheading">
        Luyện tập các bài tập Word/Excel sát với đề thi MOS — nộp bài để hệ
        thống tự động chấm điểm và hướng dẫn sửa lỗi. Bạn có thể nộp lại bao
        nhiêu lần tuỳ ý.
      </p>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={SUBJECT_TABS.map(t => ({ key: t.key, label: t.label }))}
      />

      {isFetching ? (
        <Spin />
      ) : !data || data.length === 0 ? (
        <Empty description="Chưa có đề thực hành nào" />
      ) : (
        <div className="practice-task-grid">
          {data.map(task => (
            <div
              key={task._id}
              className="practice-task-card"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/dashboard/practice/${task._id}`)}>
              <Tag color={task.subject === 'Excel' ? 'green' : 'blue'}>
                {task.subject}
              </Tag>
              <h3 className="practice-task-title">{task.title}</h3>
              {task.description && (
                <p className="practice-task-desc">{task.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticeListPage;
