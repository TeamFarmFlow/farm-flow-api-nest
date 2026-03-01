import { Injectable } from '@nestjs/common';

import { Response } from 'express';

import { Configuration } from '@app/config';

@Injectable()
export class CookieService {
  constructor(private readonly configuration: Configuration) {}

  setRefreshToken(response: Response, refreshToken: string) {
    response.cookie('x-farm-flow-refresh-token', refreshToken, {
      ...this.configuration.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 20,
    });
  }

  clearRefreshToken(response: Response) {
    response.cookie('x-farm-flow-refresh-token', '', {
      ...this.configuration.cookieOptions,
      expires: new Date(0),
      maxAge: 0,
    });
  }
}
