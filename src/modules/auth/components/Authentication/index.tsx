import { useAppSelector } from '@redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Authentication = () => {
  const router = useRouter();
  const accessToken = useAppSelector(state => state.authReducer.tokenInfo);
  useEffect(() => {
    if (accessToken) {
      router.replace('/dashboard/home');
    } else {
      router.replace('/login');
    }
  }, [accessToken, router]);
  return null;
};

export default Authentication;
