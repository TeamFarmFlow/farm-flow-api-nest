import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { Configuration } from '@app/config';
import { COOKIE_SERVICE, CookieServicePort } from '@app/core/cookies';
import { JwtClaims } from '@app/shared/security';

import { InvalidTokenException } from '../domain';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configuration: Configuration,
    @Inject(COOKIE_SERVICE)
    cookieService: CookieServicePort,
  ) {
    super({
      jwtFromRequest: (req: Request) => cookieService.parseAccessToken(req),
      secretOrKey: configuration.jwtSecret,
    });
  }

  validate(claims: JwtClaims): JwtClaims {
    if (!claims?.id) {
      throw new InvalidTokenException();
    }

    return claims;
  }
}
