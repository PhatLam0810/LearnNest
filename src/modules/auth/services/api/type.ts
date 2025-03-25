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
  username: string;
  email: string;
  bio: string;
  avatar?: string;
  role: {
    level: number;
    name: string;
  };
}
