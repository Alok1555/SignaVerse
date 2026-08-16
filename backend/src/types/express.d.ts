import { Role } from './auth'; // We can just use string or declare namespace directly

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}
export {};
