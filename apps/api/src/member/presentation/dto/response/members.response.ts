import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetMembersResult } from '@apps/api/member/application';

import { MemberResponse } from './member.response';

export class MembersResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [MemberResponse] })
  @Type(() => MemberResponse)
  @Expose()
  rows: MemberResponse[];

  public static fromResult(result: GetMembersResult) {
    const response = new MembersResponse();

    response.total = result.total;
    response.rows = result.rows.map((row) => MemberResponse.fromMember(row));

    return response;
  }
}
