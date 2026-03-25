import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { ContextUser } from '@apps/api/context';
import { GetMembersQuery } from '@apps/api/member/application';

export class GetMembersRequest {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly keyword?: string;

  toQuery(contextUser: ContextUser): GetMembersQuery {
    return {
      farmId: contextUser.farmId,
    };
  }
}
