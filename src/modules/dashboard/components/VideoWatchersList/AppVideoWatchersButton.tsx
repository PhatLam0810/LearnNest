// components/AppVideoWatchersButton.tsx
'use client';

import React from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

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
    <Tooltip title="Xem người đã xem video này">
      <Button
        type="text"
        icon={<EyeOutlined />}
        size="small"
        onClick={onClick}
        disabled={disabled}
        style={{
          color: disabled ? '#ccc' : '#1890ff',
          border: '1px solid #d9d9d9',
          borderRadius: 4,
        }}
      />
    </Tooltip>
  );
};

export default AppVideoWatchersButton;
