import { useAppSelector } from '@redux';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PROFILE_PATH = '/dashboard/profile';

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
  const mustChangePassword = !!accessToken?.userProfile?.mustChangePassword;
  useEffect(() => {
    if (accessToken) {
      // Còn cờ mustChangePassword: BE cũng chặn API (403), đây là phần điều
      // hướng để người dùng thấy ngay form đổi mật khẩu.
      if (mustChangePassword && !isPublicRoute && pathname !== PROFILE_PATH) {
        router.replace(PROFILE_PATH);
      }
      // realTimeCommentService.start();
    } else if (!isPublicRoute) {
      // realTimeCommentService.stop();
      // Logout (hoặc chưa từng đăng nhập) từ 1 route /dashboard/** -> về
      // thẳng trang chủ, không phải form /login trần.
      router.replace('/');
    }
    if (accessTokenSignUp && !accessToken && !isPublicRoute) {
      router.replace('/');
    }
  }, [
    accessToken,
    accessTokenSignUp,
    isPublicRoute,
    mustChangePassword,
    pathname,
    router,
  ]);
  return null;
};

export default Authentication;
