import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

import { CreateRoleCommand } from '@app/module/role/application';
import { PermissionKey } from '@app/shared/domain';

export class CreateRoleRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ enum: PermissionKey, isArray: true })
  @IsEnum(PermissionKey, { each: true })
  @IsArray()
  @IsNotEmpty()
  readonly permissionKeys: PermissionKey[];

  toCommand(farmId: string): CreateRoleCommand {
    return {
      farmId,
      name: this.name,
      permissionKeys: this.permissionKeys,
    };
  }
}
