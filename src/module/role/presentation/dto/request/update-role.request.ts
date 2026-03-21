import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

import { UpdateRoleCommand } from '@app/module/role/application';
import { PermissionKey } from '@app/shared/domain';

export class UpdateRoleRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ enum: PermissionKey, isArray: true })
  @IsEnum(PermissionKey, { each: true })
  @IsArray()
  @IsNotEmpty()
  readonly permissionKeys: PermissionKey[];

  toCommand(roleId: string): UpdateRoleCommand {
    return {
      roleId,
      name: this.name,
      permissionKeys: this.permissionKeys,
    };
  }
}
