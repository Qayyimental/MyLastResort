declare namespace Express {
  export interface Request {
    session: {
      id: string;
      userId?: string;
      [key: string]: any;
    }
  }
}

declare module 'xss' {
  export function sanitize(str: string): string;
}

declare module 'express-rate-limit';
declare module 'helmet';
declare module 'express-session';
declare module 'cookie-parser';
