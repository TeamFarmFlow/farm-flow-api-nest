import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

import { PermissionKey } from '@libs/shared';

import { ContextUser } from '@apps/api/context';
import { CreateRoleCommand } from '@apps/api/role/application';

export class CreateRoleRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ enum: PermissionKey, isArray: true })
  @IsEnum(PermissionKey, { each: true })
  @IsArray()
  @IsNotEmpty()
  readonly permissionKeys: PermissionKey[];

  toCommand(contextUser: ContextUser): CreateRoleCommand {
    return {
      farmId: contextUser.farmId,
      name: this.name,
      permissionKeys: this.permissionKeys,
    };
  }
}
