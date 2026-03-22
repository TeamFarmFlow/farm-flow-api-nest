import { Request, Response } from 'express';

export interface CookieServicePort {
  parseAccessToken(req: Request): string;
  parseRefreshToken(req: Request): string;
  setCacheControl(res: Response): void;
  setAuthSession(res: Response, accessToken: string, refreshToken: string): void;
  clearAuthSession(res: Response): void;
  setAccessToken(res: Response, accessToken: string): void;
  clearAccessToken(res: Response): void;
  setRefreshToken(res: Response, refreshToken: string): void;
  clearRefreshToken(res: Response): void;
}
