import { instanceToPlain } from 'class-transformer';

import { AuthPrincipal } from './auth-principal';

export class JwtClaims {
  constructor(
    readonly id: string,
    readonly farmId: string | null,
  ) {}

  public static from(userId: string, farmId: string | null = null) {
    return new JwtClaims(userId, farmId);
  }

  toObject() {
    return instanceToPlain(this);
  }

  toPrincipal(): AuthPrincipal {
    return {
      id: this.id,
      farmId: this.farmId,
    };
  }
}
