import { instanceToPlain } from 'class-transformer';

import { User, UserType } from '@app/feature/user';

export class JwtClaims {
  id: string;
  type: UserType;
  email: string;

  public static fromUser(user: User) {
    const claims = new JwtClaims();

    claims.id = user.id;
    claims.type = user.type;
    claims.email = user.email;

    return claims;
  }

  toObject() {
    return instanceToPlain(this);
  }
}
