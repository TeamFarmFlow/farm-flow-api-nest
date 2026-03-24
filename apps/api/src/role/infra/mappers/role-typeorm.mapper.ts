import { RoleEntity, RolePermissionEntity, UserEntity } from '@libs/persistence/typeorm';

import { Role, RolePermission, RoleUser } from '../../domain';

export class RoleTypeOrmMapper {
  static toRole(role: RoleEntity): Role {
    const mappedRole = new Role();

    mappedRole.id = role.id;
    mappedRole.name = role.name;
    mappedRole.super = role.super;
    mappedRole.required = role.required;
    mappedRole.farmId = role.farmId;
    mappedRole.permissions = (role.permissions ?? []).map((permission) => RoleTypeOrmMapper.toRolePermission(permission));
    mappedRole.permissionKeys = mappedRole.permissions.map(({ key }) => key);

    return mappedRole;
  }

  static toRolePermission(permission: RolePermissionEntity): RolePermission {
    const mappedPermission = new RolePermission();

    mappedPermission.id = permission.id;
    mappedPermission.roleId = permission.roleId;
    mappedPermission.key = permission.key;

    return mappedPermission;
  }

  static toRoleUser(user: UserEntity): RoleUser {
    const mappedUser = new RoleUser();

    mappedUser.id = user.id;
    mappedUser.name = user.name;
    mappedUser.email = user.email;

    return mappedUser;
  }
}
