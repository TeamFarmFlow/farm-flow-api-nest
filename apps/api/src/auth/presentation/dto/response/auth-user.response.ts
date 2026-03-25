import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { UserStatus } from '@libs/shared';

import { AuthUser } from '@apps/api/auth/domain';

export class AuthUserResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ enum: UserStatus })
  @Expose()
  status: UserStatus;

  public static fromAuthUser(authUser: AuthUser) {
    const response = new AuthUserResponse();

    response.id = authUser.id;
    response.email = authUser.email;
    response.name = authUser.name;
    response.status = authUser.status;

    return response;
  }
}
