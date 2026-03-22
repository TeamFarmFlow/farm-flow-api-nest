import { UserStatus } from '@app/shared/domain';

export class AuthUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  status: UserStatus;
}
