import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { MemberResponse } from './member.response';

export class MembersResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [MemberResponse] })
  @Type(() => MemberResponse)
  @Expose()
  rows: MemberResponse[];
}
