import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { MemberUser } from '@apps/api/member/domain';

export class MemberUserResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  public static fromMemberUser(memberUser: MemberUser) {
    const response = new MemberUserResponse();

    response.id = memberUser.id;
    response.email = memberUser.email;
    response.name = memberUser.name;

    return response;
  }
}
