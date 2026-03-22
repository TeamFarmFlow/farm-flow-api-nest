import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { GetMembersQuery } from '@apps/api/member/application';

export class GetMembersRequest {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly keyword?: string;

  toQuery(farmId: string): GetMembersQuery {
    return {
      farmId,
    };
  }
}
