import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtClaims } from '@app/shared/security';

import { AuthAccessTokenIssuerPort } from '../../application';

@Injectable()
export class JwtAccessTokenIssuer implements AuthAccessTokenIssuerPort {
  async issue(userId: string, farmId: string | null = null): Promise<string> {
    const payload = JwtClaims.from(userId, farmId).toObject();
    const expiresIn = 10 * 60;

    return this.jwtService.signAsync(payload, { expiresIn });
  }

  constructor(private readonly jwtService: JwtService) {}
}
