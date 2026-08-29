'use client';

import { useParams } from 'next/navigation';
import PracticeTaskDetailPage from '~mdDashboard/pages/PracticeTaskDetailPage';

const Page = () => {
  const { taskId } = useParams();
  return <PracticeTaskDetailPage taskId={taskId as string} />;
};

export default Page;
