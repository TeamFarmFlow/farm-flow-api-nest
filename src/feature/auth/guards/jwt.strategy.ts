import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-jwt';

import { Configuration } from '@app/config';
import { JwtClaims } from '@app/shared/security';

import { InvalidTokenException } from '../domain';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configuration: Configuration) {
    super(configuration.passportJwtStrategyOptions);
  }

  validate(claims: JwtClaims): JwtClaims {
    if (!claims?.id) {
      throw new InvalidTokenException();
    }

    return claims;
  }
}
