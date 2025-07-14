import { useAppSelector } from '@redux';
import { realTimeCommentService } from '@services/signalR';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Authentication = () => {
  const router = useRouter();
  const accessToken = useAppSelector(state => state.authReducer.tokenInfo);
  const accessTokenSignUp = useAppSelector(
    state => state.authReducer.signUpInfo,
  );
  useEffect(() => {
    if (accessToken) {
      realTimeCommentService.start();
    } else {
      realTimeCommentService.stop();
      router.replace('/login');
    }
    if (accessTokenSignUp && !accessToken) {
      router.replace('/login');
    }
  }, [accessToken, accessTokenSignUp, router]);
  return null;
};

export default Authentication;
