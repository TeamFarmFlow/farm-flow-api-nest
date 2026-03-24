import { UserStatus } from '@libs/shared';

export class AuthUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  status: UserStatus;
}
