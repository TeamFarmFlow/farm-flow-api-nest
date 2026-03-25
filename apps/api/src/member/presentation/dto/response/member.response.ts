import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { Member } from '@apps/api/member/domain';

import { MemberRoleResponse } from './member-role.response';
import { MemberUserResponse } from './member-user.response';

export class MemberResponse {
  @ApiProperty({ type: MemberUserResponse })
  @Type(() => MemberUserResponse)
  @Expose()
  user: MemberUserResponse;

  @ApiPropertyOptional({ type: MemberRoleResponse })
  @Type(() => MemberRoleResponse)
  @Expose()
  role: MemberRoleResponse | null;

  @ApiProperty({ type: Number })
  @Expose()
  payRatePerHour: number;

  @ApiProperty({ type: Number })
  @Expose()
  payDeductionAmount: number;

  public static fromMember(member: Member) {
    const response = new MemberResponse();

    response.user = MemberUserResponse.fromMemberUser(member.user);
    response.role = member.role ? MemberRoleResponse.fromMemberRole(member.role) : null;
    response.payRatePerHour = member.payRatePerHour;
    response.payDeductionAmount = member.payDeductionAmount;

    return response;
  }
}
