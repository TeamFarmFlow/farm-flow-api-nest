import { AuthFarm } from './auth-farm';
import { AuthRole } from './auth-role';

export class AuthFarmUser {
  farm: AuthFarm;
  role: AuthRole | null;
}
