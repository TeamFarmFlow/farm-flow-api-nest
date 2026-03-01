import { Injectable } from '@nestjs/common';

import { Request, Response } from 'express';

import { Configuration } from '@app/config';

@Injectable()
export class CookieService {
  private readonly REFRESH_TOKEN_KEY = 'x-farm-flow-refresh-token';

  constructor(private readonly configuration: Configuration) {}

  parseRefreshToken(request: Request): string {
    return ((request.cookies[this.REFRESH_TOKEN_KEY] as string) ?? '').trim();
  }

  setRefreshToken(response: Response, refreshToken: string) {
    response.cookie(this.REFRESH_TOKEN_KEY, refreshToken, {
      ...this.configuration.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 20,
    });
  }

  clearRefreshToken(response: Response) {
    response.cookie(this.REFRESH_TOKEN_KEY, '', {
      ...this.configuration.cookieOptions,
      expires: new Date(0),
      maxAge: 0,
    });
  }
}
