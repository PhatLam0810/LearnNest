'use client';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { messageApi } from '@hooks';
import { useToggleBookmarkMutation } from '~mdDashboard/redux';
import type { BookmarkItemType } from '~mdDashboard/redux/RTKQuery/types';

import { AppIcon } from '@components/AppIcon';
import { Bookmark, BookmarkCheck } from 'lucide';

interface BookmarkButtonProps {
  itemType: BookmarkItemType;
  itemId: string;
  // Chỉ dùng khi itemType='sublesson' để dựng link mở lại đúng bài trong khoá.
  lessonId?: string;
  // Trạng thái ban đầu do trang cha suy từ getBookmarkIds - component tự giữ
  // state optimistic sau đó.
  bookmarked?: boolean;
  size?: number;
  // Vùng bấm tối thiểu (px) — dùng khi nút nằm trong hàng danh sách để đạt
  // ≥32; bỏ trống = vừa khít icon như trước.
  hitArea?: number;
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
  hitArea,
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
      <button
        type="button"
        aria-label={saved ? 'Bỏ lưu' : 'Lưu để xem lại'}
        aria-pressed={saved}
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          minWidth: hitArea,
          minHeight: hitArea,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          borderWidth: 0,
          background: 'none',
          fontFamily: 'inherit',
          cursor: isLoading ? 'wait' : 'pointer',
          color: saved ? '#1d418a' : '#6b7280',
          fontSize: size,
          lineHeight: 1,
        }}>
        <AppIcon
          icon={saved ? BookmarkCheck : Bookmark}
          size={size}
          color={saved ? 'var(--color-vhu-primary)' : '#6b7280'}
          active={saved}
          activeColor="var(--color-vhu-primary)"
        />
        {withLabel && (
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {saved ? 'Đã lưu' : 'Lưu'}
          </span>
        )}
      </button>
    </Tooltip>
  );
};

export default BookmarkButton;
