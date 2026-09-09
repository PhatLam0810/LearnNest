'use client';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { messageApi } from '@hooks';
import { useToggleBookmarkMutation } from '~mdDashboard/redux';
import type { BookmarkItemType } from '~mdDashboard/redux/RTKQuery/types';

// @ant-design/icons không có icon bookmark (icon lưu) dạng ruy băng thật sự,
// nên dùng SVG tự vẽ hình bookmark cho đúng ý nghĩa "lưu bài" thay vì icon ngôi sao.
const BookmarkIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 2}
    strokeLinejoin="round"
    strokeLinecap="round">
    <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1z" />
  </svg>
);

interface BookmarkButtonProps {
  itemType: BookmarkItemType;
  itemId: string;
  // Chỉ dùng khi itemType='sublesson' để dựng link mở lại đúng bài trong khoá.
  lessonId?: string;
  // Trạng thái ban đầu do trang cha suy từ getBookmarkIds - component tự giữ
  // state optimistic sau đó.
  bookmarked?: boolean;
  size?: number;
  // true = kèm chữ "Đã lưu"/"Lưu"; false = chỉ icon (mặc định).
  withLabel?: boolean;
  onToggled?: (bookmarked: boolean) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  itemType,
  itemId,
  lessonId,
  bookmarked = false,
  size = 18,
  withLabel = false,
  onToggled,
}) => {
  const [saved, setSaved] = useState(bookmarked);
  const [toggle, { isLoading }] = useToggleBookmarkMutation();

  useEffect(() => {
    setSaved(bookmarked);
  }, [bookmarked]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoading || !itemId) return;
    const next = !saved;
    setSaved(next); // optimistic
    try {
      const res = await toggle({ itemType, itemId, lessonId }).unwrap();
      setSaved(res.bookmarked);
      onToggled?.(res.bookmarked);
      messageApi.success(res.bookmarked ? 'Đã lưu' : 'Đã bỏ lưu');
    } catch {
      setSaved(!next); // rollback
      messageApi.error('Không thực hiện được, thử lại sau');
    }
  };

  return (
    <Tooltip title={saved ? 'Bỏ lưu' : 'Lưu để xem lại'}>
      <span
        role="button"
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          cursor: isLoading ? 'wait' : 'pointer',
          color: saved ? '#1677ff' : '#9aa5b8',
          fontSize: size,
          lineHeight: 1,
        }}>
        <BookmarkIcon filled={saved} />
        {withLabel && (
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {saved ? 'Đã lưu' : 'Lưu'}
          </span>
        )}
      </span>
    </Tooltip>
  );
};

export default BookmarkButton;
