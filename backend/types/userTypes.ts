export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  isVerified: boolean;
  verificationCode?: string;
  resetPasswordCode?: string;
  verificationCodeExpiration: Date;
  adminCode?: string;
  isAdmin: boolean;
}
