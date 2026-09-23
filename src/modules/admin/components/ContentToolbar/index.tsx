'use client';
import React, { useState } from 'react';
import { View } from 'react-native-web';
import { Button, Input, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@components/AppIcon';
import styles from './styles';

interface ContentToolbarProps {
  searchPlaceholder?: string;
  onSearch: (value: string) => void;
  addLabel: string;
  onAdd: () => void;
  addDisabled?: boolean;
  // Lý do nút thêm đang bị khóa, hiện dạng tooltip khi rê chuột vào.
  addDisabledReason?: string;
}

const ContentToolbar: React.FC<ContentToolbarProps> = ({
  searchPlaceholder = 'Tìm kiếm',
  onSearch,
  addLabel,
  onAdd,
  addDisabled,
  addDisabledReason,
}) => {
  const [value, setValue] = useState('');

  const triggerSearch = () => onSearch(value.trim());

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.searchGroup}>
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            onPressEnter={triggerSearch}
            placeholder={searchPlaceholder}
            style={styles.searchInput}
          />
          <Button
            style={styles.searchButton}
            onClick={triggerSearch}
            icon={
              <SearchOutlined
                style={{ color: 'var(--color-text-on-primary)' }}
              />
            }
          />
        </View>
        {/* Nút disabled không bắn sự kiện chuột nên Tooltip cần bọc thêm span. */}
        <Tooltip title={addDisabled ? addDisabledReason : undefined}>
          <span>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={styles.addButton}
              disabled={addDisabled}
              onClick={onAdd}>
              {addLabel}
            </Button>
          </span>
        </Tooltip>
      </View>
    </View>
  );
};

export default ContentToolbar;
