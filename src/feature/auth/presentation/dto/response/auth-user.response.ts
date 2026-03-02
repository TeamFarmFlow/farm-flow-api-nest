import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { UserStatus, UserType } from '@app/shared/domain';

export class AuthUserResponse {
  @ApiProperty({ enum: UserType })
  @Expose()
  type: UserType;

  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ enum: UserStatus })
  @Expose()
  status: UserStatus;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt: Date;
}
