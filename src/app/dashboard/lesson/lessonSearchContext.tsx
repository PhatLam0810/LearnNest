'use client';
import React, { createContext, useContext, useMemo, useState } from 'react';

type LessonSearchContextValue = {
  keyword: string;
  sortBy: 'asc' | 'desc';
  setKeyword: (v: string) => void;
  setSortBy: (v: 'asc' | 'desc') => void;
};

const LessonSearchContext = createContext<LessonSearchContextValue | null>(
  null,
);

export const LessonSearchProvider: React.FC<{ children: React.ReactNode }> = ({
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
    <LessonSearchContext.Provider value={value}>
      {children}
    </LessonSearchContext.Provider>
  );
};

export const useLessonSearchContext = () => {
  const ctx = useContext(LessonSearchContext);
  if (!ctx) {
    throw new Error(
      'useLessonSearchContext must be used within LessonSearchProvider',
    );
  }
  return ctx;
};
