export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  isVerified: boolean;
  verificationCode: string | null;
  resetPasswordCode?: string;
  verificationCodeExpiration: Date | null;
  adminCode?: string;
  isAdmin: boolean;
}
