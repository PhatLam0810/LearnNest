'use client';
import React, { createContext, useContext, useMemo, useState } from 'react';

type SearchContextValue = {
  keyword: string;
  sortBy: 'asc' | 'desc';
  setKeyword: (v: string) => void;
  setSortBy: (v: 'asc' | 'desc') => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('desc');

  const value = useMemo(
    () => ({
      keyword,
      sortBy,
      setKeyword,
      setSortBy,
    }),
    [keyword, sortBy],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearchContext must be used within SearchProvider');
  }
  return ctx;
};
