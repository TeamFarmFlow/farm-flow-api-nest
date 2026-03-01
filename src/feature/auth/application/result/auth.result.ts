import { User } from '@app/feature/user';

export type AuthResult = {
  refreshToken: string;
  accessToken: string;
  expiresIn: number;
  expiresAt: Date;
  user: User;
};
