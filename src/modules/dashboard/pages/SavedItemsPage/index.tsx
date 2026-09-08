'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Empty, Spin, Tabs, Tag } from 'antd';
import { useGetBookmarksQuery } from '~mdDashboard/redux';
import type { BookmarkItemType } from '~mdDashboard/redux/RTKQuery/types';
import BookmarkButton from '@components/BookmarkButton';
import './styles.scss';

const TABS: { key: BookmarkItemType; label: string }[] = [
  { key: 'sublesson', label: 'Bài học' },
  { key: 'practiceTask', label: 'Bài thực hành' },
  { key: 'library', label: 'Tài liệu' },
  { key: 'lesson', label: 'Khoá học' },
];

const SavedItemsPage: React.FC = () => {
  const router = useRouter();
  const [active, setActive] = useState<BookmarkItemType>('sublesson');
  const { data: items, isFetching } = useGetBookmarksQuery(active);

  return (
    <div className="saved-items-page">
      <h1 className="saved-items-heading">Đã lưu</h1>
      <p className="saved-items-sub">Những mục bạn đánh dấu để xem lại sau.</p>

      <Tabs
        activeKey={active}
        onChange={k => setActive(k as BookmarkItemType)}
        items={TABS.map(t => ({ key: t.key, label: t.label }))}
      />

      {isFetching && !items ? (
        <div className="saved-items-center">
          <Spin />
        </div>
      ) : !items || items.length === 0 ? (
        <Empty description="Chưa có mục nào được lưu ở đây." />
      ) : (
        <div className="saved-items-list">
          {items.map(it => (
            <div
              key={it._id}
              className="saved-item-row"
              role="button"
              tabIndex={0}
              onClick={() => router.push(it.link)}>
              <div className="saved-item-main">
                <span className="saved-item-title">{it.title}</span>
                {it.subject && (
                  <Tag color={it.subject === 'Excel' ? 'green' : 'blue'}>
                    {it.subject}
                  </Tag>
                )}
              </div>
              <BookmarkButton
                itemType={it.itemType}
                itemId={it.itemId}
                lessonId={it.lessonId}
                bookmarked
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItemsPage;
