

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode?: string;
  resetPasswordCode?: string;
  adminCode?: string;
  isAdmin: boolean;
}

