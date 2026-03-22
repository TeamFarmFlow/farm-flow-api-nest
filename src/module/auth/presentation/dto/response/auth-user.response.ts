import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { UserStatus } from '@app/shared/domain';

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
}
