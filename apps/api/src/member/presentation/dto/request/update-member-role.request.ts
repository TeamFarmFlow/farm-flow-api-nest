import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsUUID } from 'class-validator';

import { UpdateMemberRoleCommand } from '@apps/api/member/application';

export class UpdateMemberRoleRequest {
  @ApiPropertyOptional({ type: String })
  @IsUUID(4)
  @IsOptional()
  readonly roleId?: string;

  toCommand(farmId: string, userId: string): UpdateMemberRoleCommand {
    return {
      farmId,
      userId,
      roleId: this.roleId,
    };
  }
}
