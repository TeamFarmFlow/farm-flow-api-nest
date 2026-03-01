import { User } from '@app/feature/user';

export type AuthResult = {
  accessToken: string;
  expiresIn: number;
  expiresAt: Date;
  user: User;
};
