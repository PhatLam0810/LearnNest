import type { ReactNode } from 'react';
import './authLayout.css';

// Nền ambient (blob gradient màu VHU, tự trôi nhẹ bằng CSS) + hiệu ứng
// slide-up/fade-in lúc vào trang - dùng chung cho toàn bộ nhóm (auth)
// (login, signup, forgotPassword...) thay vì lặp lại ở từng trang.
// ponytail: CSS blob thay vì WebGL shader thật - nhẹ hơn nhiều, không thêm
// dependency, hiệu ứng "ambient" vẫn đạt; nâng cấp lên shader nếu sau này
// cần hiệu ứng phức tạp hơn (particles, mưa, v.v.).
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-bg">
      <div className="auth-enter">{children}</div>
    </div>
  );
}
