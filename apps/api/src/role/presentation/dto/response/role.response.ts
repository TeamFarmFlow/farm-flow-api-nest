import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { PermissionKey } from '@libs/shared';

import { Role } from '@apps/api/role/domain';

export class RoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  super: boolean;

  @ApiProperty({ type: Boolean })
  @Expose()
  required: boolean;

  @ApiProperty({ enum: PermissionKey, isArray: true })
  @Expose()
  permissionKeys: PermissionKey[];

  public static fromRole(role: Role) {
    const response = new RoleResponse();

    response.id = role.id;
    response.name = role.name;
    response.super = role.super;
    response.required = role.required;
    response.permissionKeys = role.permissionKeys;

    return response;
  }
}
