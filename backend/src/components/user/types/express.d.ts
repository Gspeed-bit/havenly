import  IUser  from '@components/user/models/userModel';
import { Server as IOServer } from 'socket.io';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser; // Authenticated user object
      io?: IOServer; // Socket.io instance
    }
  }
}
