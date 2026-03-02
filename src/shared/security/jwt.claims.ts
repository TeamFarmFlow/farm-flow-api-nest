import { instanceToPlain } from 'class-transformer';

import { UserType } from '../domain';

import { AuthPrincipal } from './auth-principal';

export class JwtClaims {
  constructor(
    readonly id: string,
    readonly type: UserType,
    readonly email: string,
  ) {}

  public static fromPrincipal(princinal: AuthPrincipal) {
    return new JwtClaims(princinal.id, princinal.type, princinal.email);
  }

  toObject() {
    return instanceToPlain(this);
  }

  toPrincipal(): AuthPrincipal {
    return {
      id: this.id,
      type: this.type,
      email: this.email,
    };
  }
}
