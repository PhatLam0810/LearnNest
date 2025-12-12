'use client';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Input } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { View } from 'react-native-web';
import styles from '../../styles';
import { useLessonSearchContext } from '../lessonSearchContext';

const LessonSearchBar: React.FC = () => {
  const { setKeyword, sortBy, setSortBy } = useLessonSearchContext();
  const [text, setText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(text.trim());
    }, 1500); // debounce 1.5s

    return () => clearTimeout(timer);
  }, [text]);

  const sortItems = [
    { key: 'desc', label: 'Desc' },
    { key: 'asc', label: 'Asc' },
  ];

  const filterButton = (
    <Dropdown
      trigger={['hover']}
      menu={{
        items: sortItems,
        selectedKeys: [sortBy],
        onClick: ({ key }) => setSortBy(key as 'desc' | 'asc'),
      }}>
      <Button
        type="text"
        icon={<FilterOutlined style={{ fontSize: 18 }} />}
        style={{
          borderRadius: 999,
          color: '#475569',
        }}
        aria-label="Filter lessons"
      />
    </Dropdown>
  );

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Input
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        suffix={filterButton}
        placeholder="Search lessons"
        allowClear
        size="large"
        value={text}
        onChange={e => setText(e.target.value)}
        onPressEnter={() => setKeyword(text.trim())}
        style={{ ...styles.searchInput, flex: 1, maxWidth: 540 }}
      />
    </View>
  );
};

export default LessonSearchBar;
