import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsUUID } from 'class-validator';

import { ContextUser } from '@apps/api/context';
import { UpdateMemberRoleCommand } from '@apps/api/member/application';

export class UpdateMemberRoleRequest {
  @ApiPropertyOptional({ type: String })
  @IsUUID(4)
  @IsOptional()
  readonly roleId?: string;

  toCommand(userId: string, contextUser: ContextUser): UpdateMemberRoleCommand {
    return {
      farmId: contextUser.farmId,
      userId,
      roleId: this.roleId,
    };
  }
}
