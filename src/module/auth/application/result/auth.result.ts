import { AuthFarm, AuthRole, AuthUser } from '../../domain';

export type AuthResult = {
  user: AuthUser;
  farm: AuthFarm | null;
  role: AuthRole | null;
};
