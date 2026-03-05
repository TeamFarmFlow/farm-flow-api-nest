import { Farm, Role, User } from '@app/infra/persistence/typeorm';

export type AuthResult = {
  user: User;
  farm: Farm | null;
  role: Role | null;
};
