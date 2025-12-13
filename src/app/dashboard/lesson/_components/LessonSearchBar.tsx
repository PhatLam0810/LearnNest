'use client';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Input } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { View } from 'react-native-web';
import styles from '../../styles';
import { useLessonSearchContext } from '../lessonSearchContext';
import { useResponsive } from '@/styles/responsive';

const LessonSearchBar: React.FC = () => {
  const { setKeyword, sortBy, setSortBy } = useLessonSearchContext();
  const [text, setText] = useState('');
  const { isMobile, isTablet } = useResponsive();

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

  // Match searchWrap style from layout.tsx
  const searchWrapStyle = {
    ...styles.searchWrap,
    maxWidth: isMobile ? '100%' : isTablet ? 400 : 540,
  };

  const searchInputStyle = {
    ...styles.searchInput,
    height: isMobile ? 36 : 40,
    paddingHorizontal: isMobile ? 10 : 12,
    fontSize: isMobile ? 14 : 16,
  };

  return (
    <View style={searchWrapStyle}>
      <Input
        prefix={
          <SearchOutlined
            style={{
              color: '#94a3b8',
              fontSize: isMobile ? 16 : 18,
            }}
          />
        }
        suffix={!isMobile ? filterButton : undefined}
        placeholder={isMobile ? 'Search...' : 'Search lessons'}
        allowClear
        size={isMobile ? 'middle' : 'large'}
        value={text}
        onChange={e => setText(e.target.value)}
        onPressEnter={() => setKeyword(text.trim())}
        style={searchInputStyle}
      />
    </View>
  );
};

export default LessonSearchBar;
