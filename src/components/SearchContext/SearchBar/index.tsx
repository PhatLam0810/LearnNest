'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AutoComplete, Button, Dropdown, Empty, Input, Spin, Tag } from 'antd';
import { FilterOutlined, SearchOutlined } from '@components/AppIcon';
import { useResponsive } from '@/styles/responsive';
import { dashboardQuery } from '~mdDashboard/redux';
import { useSearchContext } from '..';

const MIN_SEARCH_LENGTH = 2;

const SearchBar: React.FC = () => {
  const router = useRouter();
  const { setKeyword, sortBy, setSortBy } = useSearchContext();
  const [text, setText] = useState('');
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(text.trim());
    }, 1500); // debounce 1.5s

    return () => clearTimeout(timer);
  }, [text]);

  // Tìm kiếm TOÀN HỆ THỐNG (khóa học + nội dung + bài thực hành), khác hẳn
  // `keyword` ở trên (chỉ lọc danh sách ĐANG hiện sẵn trên trang
  // /dashboard/lesson, /dashboard/library — xem 2 trang đó). Debounce riêng,
  // ngắn hơn, vì đây là gõ-để-xem-gợi-ý chứ không phải gõ-để-lọc-danh-sách.
  const [globalQuery, setGlobalQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setGlobalQuery(text.trim()), 400);
    return () => clearTimeout(timer);
  }, [text]);

  const { data: results, isFetching: isSearching } =
    dashboardQuery.useSearchQuery(globalQuery, {
      skip: globalQuery.length < MIN_SEARCH_LENGTH,
    });

  const sections = [
    { label: 'Khóa học', items: results?.lessons },
    { label: 'Nội dung', items: results?.libraries },
    { label: 'Bài thực hành', items: results?.tasks },
  ].filter(s => s.items && s.items.length > 0);

  const searchOptions = sections.map(s => ({
    label: s.label,
    options: s.items!.map(item => ({
      value: item._id,
      link: item.link,
      label: (
        <div className="search-result-option">
          <span className="search-result-title">{item.title}</span>
          {item.meta && <Tag>{item.meta}</Tag>}
        </div>
      ),
    })),
  }));

  const isDropdownOpen = globalQuery.length >= MIN_SEARCH_LENGTH;

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

  return (
    <div>
      <AutoComplete
        style={{ width: '100%' }}
        popupMatchSelectWidth={isMobile ? 260 : 420}
        options={searchOptions}
        open={isDropdownOpen}
        filterOption={false}
        notFoundContent={
          !isDropdownOpen ? null : isSearching ? (
            <Spin size="small" />
          ) : (
            <Empty
              description="Không tìm thấy kết quả"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        }
        onSelect={(_value, option: any) => {
          router.push(option.link);
          setText('');
          setGlobalQuery('');
        }}
        onChange={value => setText(value)}>
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
          placeholder={isMobile ? 'Tìm...' : 'Tìm khóa học, bài thực hành...'}
          allowClear
          size={isMobile ? 'middle' : 'large'}
          onPressEnter={() => setKeyword(text.trim())}
          className="search-input"
        />
      </AutoComplete>
    </div>
  );
};

export default SearchBar;
