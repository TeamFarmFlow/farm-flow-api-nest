import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';

import { UpdateMemberRoleCommand } from '@app/feature/member/application';

export class UpdateMemberRoleRequest {
  @ApiProperty({ type: String })
  @IsUUID(4)
  @IsNotEmpty()
  readonly roleId: string;

  toCommand(farmId: string, userId: string): UpdateMemberRoleCommand {
    return {
      roleId: this.roleId,
      farmId,
      userId,
    };
  }
}
