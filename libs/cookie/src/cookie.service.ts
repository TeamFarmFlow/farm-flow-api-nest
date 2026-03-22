import { Injectable } from '@nestjs/common';

import { Request, Response } from 'express';

import { Configuration } from '@libs/config';

import { CookieServicePort } from './ports';

@Injectable()
export class CookieService implements CookieServicePort {
  public readonly ACCESS_TOKEN_KEY = 'x-farm-flow-access-token';
  public readonly REFRESH_TOKEN_KEY = 'x-farm-flow-refresh-token';

  constructor(private readonly configuration: Configuration) {}

  parseAccessToken(request: Request): string {
    return ((request.cookies[this.ACCESS_TOKEN_KEY] as string) ?? '').trim();
  }

  parseRefreshToken(request: Request): string {
    return ((request.cookies[this.REFRESH_TOKEN_KEY] as string) ?? '').trim();
  }

  setCacheControl(response: Response): void {
    response.setHeader('Cache-Control', 'no-store');
  }

  setAuthSession(response: Response, accessToken: string, refreshToken: string): void {
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);
  }

  clearAuthSession(response: Response): void {
    this.clearAccessToken(response);
    this.clearRefreshToken(response);
  }

  setAccessToken(response: Response, accessToken: string): void {
    response.cookie(this.ACCESS_TOKEN_KEY, accessToken, {
      ...this.configuration.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 20,
      path: '/',
    });
  }

  clearAccessToken(response: Response): void {
    response.cookie(this.ACCESS_TOKEN_KEY, '', {
      ...this.configuration.cookieOptions,
      expires: new Date(0),
      maxAge: 0,
      path: '/',
    });
  }

  setRefreshToken(response: Response, refreshToken: string) {
    response.cookie(this.REFRESH_TOKEN_KEY, refreshToken, {
      ...this.configuration.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 20,
      path: '/api/v1',
    });
  }

  clearRefreshToken(response: Response) {
    response.cookie(this.REFRESH_TOKEN_KEY, '', {
      ...this.configuration.cookieOptions,
      expires: new Date(0),
      maxAge: 0,
      path: '/api/v1',
    });
  }
}
