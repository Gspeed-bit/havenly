// backend/types/express.d.ts

import express from 'express';
import { IUser } from './userTypes';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
