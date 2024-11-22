import { IUser } from 'src/components/user/types/userTypes';
import { Server as IOServer } from 'socket.io';
declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      io?: IOServer;
    }
  }
}
