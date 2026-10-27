export interface UserItem {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  // Premium: BE trả premiumExpiresAt; isPremium chỉ để hiển thị (còn hạn hay không).
  isPremium?: boolean;
  premiumExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName?: string;
  studentId?: string;
  class?: string;
  faculty?: string;
  major?: string;
  // Loại tài khoản: 'student' = sinh viên VHU, 'guest' = khách. Tài khoản cũ
  // chưa có field này.
  userType?: 'student' | 'guest';
  phoneNumber?: string;
  bio?: string;
}

export interface Role {
  _id: string;
  name: string;
  level: number;
  permissions: any[];
  __v: number;
}
