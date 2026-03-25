import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { PermissionKey } from '@libs/shared';

import { AuthRole } from '@apps/api/auth/domain';

export class AuthRoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  required: boolean;

  @ApiProperty({ type: Boolean })
  @Expose()
  super: boolean;

  @ApiProperty({ enum: PermissionKey, isArray: true })
  @Expose()
  permissionKeys: PermissionKey[];

  public static fromAuthRole(authRole: AuthRole) {
    const response = new AuthRoleResponse();

    response.id = authRole.id;
    response.name = authRole.name;
    response.required = authRole.required;
    response.super = authRole.super;
    response.permissionKeys = authRole.permissionKeys;

    return response;
  }
}
