import { Request } from 'express';
import session from 'express-session';

declare module 'express-session' {
   interface Request {
    user: { [key: string]: any };
  }
}