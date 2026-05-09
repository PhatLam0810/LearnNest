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
