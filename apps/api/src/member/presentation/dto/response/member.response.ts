import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { MemberRoleResponse } from './member-role.response';
import { MemberUserResponse } from './member-user.response';

export class MemberResponse {
  @ApiProperty({ type: MemberUserResponse })
  @Type(() => MemberUserResponse)
  @Expose()
  user: MemberUserResponse;

  @ApiProperty({ type: MemberRoleResponse })
  @Type(() => MemberRoleResponse)
  @Expose()
  role: MemberRoleResponse;

  @ApiProperty({ type: Number })
  @Expose()
  payRatePerHour: number;

  @ApiProperty({ type: Number })
  @Expose()
  payDeductionAmount: number;
}
