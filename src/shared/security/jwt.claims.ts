import { instanceToPlain } from 'class-transformer';

import { AuthPrincipal } from './auth-principal';

export class JwtClaims {
  constructor(
    readonly id: string,
    readonly email: string,
  ) {}

  public static fromPrincipal(princinal: AuthPrincipal) {
    return new JwtClaims(princinal.id, princinal.email);
  }

  toObject() {
    return instanceToPlain(this);
  }

  toPrincipal(): AuthPrincipal {
    return {
      id: this.id,
      email: this.email,
    };
  }
}
