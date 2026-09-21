'use client';
import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import type { AvatarProps } from 'antd';

const AVATAR_COLORS = [
  '#1d418a',
  '#a16207',
  '#15803d',
  '#c81e1e',
  '#7c3aed',
  '#0e7490',
  '#c2410c',
  '#0f766e',
];

export const getAvatarColor = (seed?: string) => {
  if (!seed) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Chữ cái đầu khi user chưa có ảnh đại diện - lấy chữ cái đầu của từ ĐẦU và
// từ CUỐI trong họ tên đăng ký (vd "Lam Tan Phat" -> "LP", "Lê Quốc Toàn" ->
// "LT"). Tên 1 từ thì lấy 2 chữ cái đầu của từ đó.
export const getInitials = (fullName?: string) => {
  const words = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'children'> {
  avatar?: string;
  fullName?: string;
  // Id (hoặc chuỗi bất kỳ) dùng để chọn màu ổn định theo từng user.
  seed?: string;
}

// Avatar mặc định dùng chung toàn app: ảnh thật nếu có, không thì vòng tròn
// màu (theo hash id) kèm 2 chữ cái đầu tên - đồng nhất 1 kiểu ở mọi nơi hiển
// thị avatar (bình luận, hồ sơ, đánh giá khoá học, danh sách người xem,
// phản hồi người dùng...) thay vì mỗi nơi một kiểu fallback khác nhau.
const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  fullName,
  seed,
  style,
  ...rest
}) => {
  // Một số tài khoản cũ có `avatar` là chuỗi khác rỗng nhưng bị hỏng/không
  // tải được (ví dụ dữ liệu test) - nếu chỉ dựa vào "có avatar hay không" để
  // quyết định hiện chữ cái đầu thì trường hợp này sẽ ra vòng tròn trắng
  // trơn (antd không có gì để fallback). Theo dõi lỗi tải ảnh qua state để
  // luôn có đường lui về vòng tròn màu + chữ cái đầu.
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => {
    setImgFailed(false);
  }, [avatar]);

  const hasValidAvatar = !!avatar && !imgFailed;

  return (
    <Avatar
      src={hasValidAvatar ? avatar : undefined}
      onError={() => {
        setImgFailed(true);
        return false;
      }}
      style={
        !hasValidAvatar
          ? {
              backgroundColor: getAvatarColor(seed),
              fontWeight: 600,
              ...style,
            }
          : style
      }
      {...rest}>
      {!hasValidAvatar && getInitials(fullName)}
    </Avatar>
  );
};

export default UserAvatar;
