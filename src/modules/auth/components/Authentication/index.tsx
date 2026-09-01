import { useAppSelector } from '@redux';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Authentication = () => {
  const router = useRouter();
  const pathname = usePathname();
  // Chỉ /dashboard/** cần đăng nhập - trang giới thiệu, login, signup... phải
  // xem được công khai, không bị ép về /login.
  const isPublicRoute = !pathname.startsWith('/dashboard');
  const accessToken = useAppSelector(state => state.authReducer.tokenInfo);
  const accessTokenSignUp = useAppSelector(
    state => state.authReducer.signUpInfo,
  );
  useEffect(() => {
    if (accessToken) {
      // realTimeCommentService.start();
    } else if (!isPublicRoute) {
      // realTimeCommentService.stop();
      router.replace('/login');
    }
    if (accessTokenSignUp && !accessToken && !isPublicRoute) {
      router.replace('/login');
    }
  }, [accessToken, accessTokenSignUp, isPublicRoute, router]);
  return null;
};

export default Authentication;
