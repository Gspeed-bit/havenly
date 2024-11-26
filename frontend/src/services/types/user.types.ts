// frontend/types/user.types.ts

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  imgUrl?: string;
  password: string;
  confirmPassword: string;
  isVerified: boolean;
  verificationCode: string | null;
  verificationCodeExpiration: Date | null;
  resetPasswordCode?: string | null;
  resetPasswordExpiration?: Date | null;
  adminCode?: string;
  isAdmin: boolean;
}

// types/user.types.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
  };
}

// user.types.ts

// Request type for signup
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminCode?: string; // Optional field
}

// Response type for signup
export interface SignUpResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    userId: string;
    email: string;
    isAdmin: boolean;
  };
}


export interface VerificationCodeResponse {
  email: string;
  codeExpiration: string; // ISO date string
  message: string;
}



export interface VerifyAccountResponse {
  message: string;
}