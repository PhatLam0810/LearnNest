export interface UserItem {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  subscription: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName?: string;
  bio?: string;
}

export interface Role {
  _id: string;
  name: string;
  level: number;
  permissions: any[];
  __v: number;
}
