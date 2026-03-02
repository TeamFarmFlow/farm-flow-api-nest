import { UserType } from '../domain';

export class AuthPrincipal {
  constructor(
    readonly id: string,
    readonly type: UserType,
    readonly email: string,
  ) {}
}
