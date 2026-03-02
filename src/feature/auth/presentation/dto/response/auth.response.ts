import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { AuthUserResponse } from './auth-user.response';

export class AuthResponse {
  @ApiProperty({ type: String })
  @Expose()
  accessToken: string;

  @ApiProperty({ type: Number })
  @Expose()
  expiresIn: number;

  @ApiProperty({ type: Date })
  @Expose()
  expiresAt: Date;

  @ApiProperty({ type: AuthUserResponse })
  @Type(() => AuthUserResponse)
  @Expose()
  user: AuthUserResponse;
}
