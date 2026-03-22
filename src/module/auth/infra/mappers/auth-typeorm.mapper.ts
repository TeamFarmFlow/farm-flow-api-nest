import { Farm, FarmUser, Role, User } from '@app/infra/persistence/typeorm';

import { AuthFarm, AuthFarmUser, AuthRole, AuthUser } from '../../domain';

export class AuthTypeOrmMapper {
  static toAuthUser(user: User): AuthUser {
    const authUser = new AuthUser();

    authUser.id = user.id;
    authUser.email = user.email;
    authUser.passwordHash = user.password;
    authUser.name = user.name;
    authUser.status = user.status;

    return authUser;
  }

  static toAuthFarm(farm: Farm): AuthFarm {
    const authFarm = new AuthFarm();

    authFarm.id = farm.id;
    authFarm.name = farm.name;

    return authFarm;
  }

  static toAuthRole(role: Role): AuthRole {
    const authRole = new AuthRole();

    authRole.id = role.id;
    authRole.name = role.name;
    authRole.required = role.required;
    authRole.super = role.super;
    authRole.permissionKeys = role.permissionKeys ?? [];

    return authRole;
  }

  static toAuthFarmUser(farmUser: FarmUser): AuthFarmUser {
    const authFarmUser = new AuthFarmUser();

    authFarmUser.farm = this.toAuthFarm(farmUser.farm);
    authFarmUser.role = farmUser.role ? this.toAuthRole(farmUser.role) : null;

    return authFarmUser;
  }
}
