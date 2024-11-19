import { IUser } from 'src/components/user/types/userTypes';
declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
