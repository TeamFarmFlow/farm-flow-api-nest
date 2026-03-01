import { User } from '@app/infra/persistence/typeorm';

export type AuthResult = {
  accessToken: string;
  expiresIn: number;
  expiresAt: Date;
  user: User;
};
