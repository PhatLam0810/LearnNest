'use client';

import { useParams } from 'next/navigation';
import PracticeCourseDetailPage from '~mdDashboard/pages/PracticeCourseDetailPage';

const Page = () => {
  const { lessonId } = useParams();
  return <PracticeCourseDetailPage lessonId={lessonId as string} />;
};

export default Page;
