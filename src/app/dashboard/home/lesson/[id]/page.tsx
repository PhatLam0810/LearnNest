'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import LessonDetailPage from '~mdDashboard/pages/LessonDetailPage';

const Page = () => {
  const { id } = useParams();
  return <LessonDetailPage id={id as string} />;
};

export default Page;
