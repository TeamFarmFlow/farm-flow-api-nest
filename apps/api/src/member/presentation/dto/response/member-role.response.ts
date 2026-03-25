import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { MemberRole } from '@apps/api/member/domain';

export class MemberRoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  super: boolean;

  @ApiProperty({ type: Boolean })
  @Expose()
  required: boolean;

  public static fromMemberRole(memberRole: MemberRole) {
    const response = new MemberRoleResponse();

    response.id = memberRole.id;
    response.name = memberRole.name;
    response.super = memberRole.super;
    response.required = memberRole.required;

    return response;
  }
}
