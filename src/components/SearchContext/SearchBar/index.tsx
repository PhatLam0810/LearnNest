'use client';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Input } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useResponsive } from '@/styles/responsive';
import { useSearchContext } from '..';

const SearchBar: React.FC = () => {
  const { setKeyword, sortBy, setSortBy } = useSearchContext();
  const [text, setText] = useState('');
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(text.trim());
    }, 1500); // debounce 1.5s

    return () => clearTimeout(timer);
  }, [text]);

  const sortItems = [
    { key: 'desc', label: 'Cũ nhất' },
    { key: 'asc', label: 'Mới nhất' },
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

  return (
    <div>
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
        placeholder={isMobile ? 'Tìm...' : 'Tìm khóa học'}
        allowClear
        size={isMobile ? 'middle' : 'large'}
        value={text}
        onChange={e => setText(e.target.value)}
        onPressEnter={() => setKeyword(text.trim())}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
