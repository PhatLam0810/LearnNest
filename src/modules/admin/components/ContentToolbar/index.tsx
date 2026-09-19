'use client';
import React, { useState } from 'react';
import { View } from 'react-native-web';
import { Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './styles';

interface ContentToolbarProps {
  searchPlaceholder?: string;
  onSearch: (value: string) => void;
  addLabel: string;
  onAdd: () => void;
}

const ContentToolbar: React.FC<ContentToolbarProps> = ({
  searchPlaceholder = 'Tìm kiếm',
  onSearch,
  addLabel,
  onAdd,
}) => {
  const [value, setValue] = useState('');

  const triggerSearch = () => onSearch(value.trim());

  return (
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
            <SearchOutlined style={{ color: 'var(--color-text-on-primary)' }} />
          }
        />
      </View>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={styles.addButton}
        onClick={onAdd}>
        {addLabel}
      </Button>
    </View>
  );
};

export default ContentToolbar;
