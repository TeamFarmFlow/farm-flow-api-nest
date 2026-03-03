import { Farm, Role, User } from '@app/infra/persistence/typeorm';

export type AuthResult = {
  accessToken: string;
  expiresIn: number;
  expiresAt: Date;
  user: User;
  farm: Farm | null;
  role: Role | null;
};
