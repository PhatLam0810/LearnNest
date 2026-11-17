'use client';

import { Suspense } from 'react';
import PracticeHubPage from '~mdDashboard/pages/PracticeHubPage';

// useSearchParams (chọn mục) cần Suspense khi prerender.
const Page = () => (
  <Suspense fallback={null}>
    <PracticeHubPage />
  </Suspense>
);

export default Page;
