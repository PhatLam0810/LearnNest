// components/AppVideoWatchersButton.tsx
'use client';

import React from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined } from '@components/AppIcon';

interface AppVideoWatchersButtonProps {
  subLessonId: string;
  subLessonTitle: string;
  disabled?: boolean;
  onClick?: (e?: any) => void;
}

const AppVideoWatchersButton: React.FC<AppVideoWatchersButtonProps> = ({
  subLessonId,
  subLessonTitle,
  disabled = false,
  onClick,
}) => {
  return (
    <Tooltip title="Xem danh sách người đã học bài này">
      <Button
        type="text"
        icon={<EyeOutlined />}
        size="middle"
        aria-label="Xem danh sách người đã học bài này"
        onClick={onClick}
        disabled={disabled}
        style={{
          color: disabled
            ? 'var(--color-text-disabled)'
            : 'var(--color-vhu-primary)',
        }}
      />
    </Tooltip>
  );
};

export default AppVideoWatchersButton;
