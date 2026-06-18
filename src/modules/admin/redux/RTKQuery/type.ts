export interface GetCategoriesAllResponse {
  today: [];
}

export interface SetRoleParams {
  userId: string;
  role: number;
}

export interface DeleteAdminRoleParams {
  _id: string;
  roleId: string;
}

export interface CreateUserParams {
  email: string;
  phone: number;
  fullName: string;
  studentId: string;
  password: string;
}

export interface ImportUserItem {
  fullName: string;
  studentId: string;
  email: string;
  class?: string;
  faculty?: string;
  major?: string;
}

export interface ImportUserPreviewRequest {
  fileUrl: string;
}

export interface ImportUsersRequest {
  users: ImportUserItem[];
}

export interface ImportUsersResponse {
  successful: Array<{
    email: string;
    fullName: string;
    username: string;
    password: string;
  }>;
  failed: Array<{
    fullName: string;
    studentId: string;
    email: string;
    error: string;
  }>;
  accounts: Array<{
    email: string;
    fullName: string;
    username: string;
    password: string;
  }>;
}

export interface SendImportEmailsRequest {
  accounts: Array<{
    email: string;
    fullName: string;
    username: string;
    password: string;
  }>;
}

export interface SendImportEmailsResponse {
  successful: number;
  failed: number;
  details: Array<{
    email: string;
    status: 'fulfilled' | 'rejected';
    success: boolean;
    error: string | null;
  }>;
}
