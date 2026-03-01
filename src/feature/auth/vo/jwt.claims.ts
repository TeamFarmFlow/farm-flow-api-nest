import { instanceToPlain } from 'class-transformer';

import { User, UserType } from '@app/feature/user';

export class JwtClaims {
  constructor(
    readonly id: string,
    readonly type: UserType,
    readonly email: string,
  ) {}

  public static fromUser(user: User) {
    return new JwtClaims(user.id, user.type, user.email);
  }

  toObject() {
    return instanceToPlain(this);
  }
}
