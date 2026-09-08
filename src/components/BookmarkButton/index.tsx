'use client';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { messageApi } from '@hooks';
import { useToggleBookmarkMutation } from '~mdDashboard/redux';
import type { BookmarkItemType } from '~mdDashboard/redux/RTKQuery/types';

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
          color: saved ? '#f5a623' : '#9aa5b8',
          fontSize: size,
          lineHeight: 1,
        }}>
        {saved ? <StarFilled /> : <StarOutlined />}
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
