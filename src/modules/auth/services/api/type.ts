export type LoginApiReq = {
  email: string;
  password: string;
};

export type OtpApiReq = {
  email: string;
};

export type SignUpApiReq = {
  email: string;
  password: string;
};

export type LoginOauthApiReq = {
  token: string;
};

export type loginApiRes = {
  accessToken: string;
  refreshToken: string;
  userProfile: UserProfile;
};

export type signUpApiRes = {
  accessToken: string;
  refreshToken: string;
  userProfile: UserProfile;
};

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  bio: string;
  avatar?: string;
  studyReminderEnabled?: boolean;
  disabledNotificationTypes?: string[];
  // false = tài khoản tạo qua Google Sign-In, chưa từng đặt mật khẩu -
  // trang hồ sơ dùng để hiện "Đặt mật khẩu" thay vì "Đổi mật khẩu".
  hasPassword?: boolean;
  // true = tài khoản do admin tạo/đặt lại, phải đổi mật khẩu trước khi dùng tiếp.
  mustChangePassword?: boolean;
  role: {
    level: number;
    name: string;
  };
}
