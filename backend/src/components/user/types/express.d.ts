import IUser from '@components/user/models/userModel';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser; // Authenticated user object
    }
  }
}
