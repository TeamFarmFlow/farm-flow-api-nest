import { Injectable } from '@nestjs/common';

import { Request, Response } from 'express';

import { Configuration } from '@app/config';

@Injectable()
export class CookieService {
  public readonly ACCESS_TOKEN_KEY = 'x-farm-flow-access-token';
  public readonly REFRESH_TOKEN_KEY = 'x-farm-flow-refresh-token';

  constructor(private readonly configuration: Configuration) {}

  parseAccessToken(request: Request): string {
    return ((request.cookies[this.ACCESS_TOKEN_KEY] as string) ?? '').trim();
  }

  parseRefreshToken(request: Request): string {
    return ((request.cookies[this.REFRESH_TOKEN_KEY] as string) ?? '').trim();
  }

  setCacheControl(response: Response) {
    response.setHeader('Cache-Control', 'no-store');
  }

  setAccessToken(response: Response, accessToken: string) {
    response.cookie(this.ACCESS_TOKEN_KEY, accessToken, {
      ...this.configuration.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 20,
      path: '/',
    });
  }

  clearAccessToken(response: Response) {
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
