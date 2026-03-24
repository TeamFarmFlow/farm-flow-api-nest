import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { PermissionKey } from '@libs/shared';

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
}
