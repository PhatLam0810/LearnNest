'use client';

import { useParams } from 'next/navigation';
import { LessonAnalyticsPage } from '../components/LessonOverView/_component';

const Page = () => {
  const { lessonId } = useParams();
  return <LessonAnalyticsPage lessonId={lessonId as string} />;
};

export default Page;
