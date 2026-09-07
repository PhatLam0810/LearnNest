'use client';

import { useParams } from 'next/navigation';
import MockExamAttemptPage from '~mdDashboard/pages/MockExamAttemptPage';

const Page = () => {
  const { attemptId } = useParams();
  return <MockExamAttemptPage attemptId={attemptId as string} />;
};

export default Page;
