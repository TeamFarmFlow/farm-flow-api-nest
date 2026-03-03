import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { AuthFarmResponse } from './auth-farm.response';
import { AuthRoleResponse } from './auth-role.response';
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

  @ApiProperty({ type: AuthFarmResponse, nullable: true })
  @Type(() => AuthFarmResponse)
  @Expose()
  farm: AuthFarmResponse | null;

  @ApiProperty({ type: AuthRoleResponse, nullable: true })
  @Type(() => AuthRoleResponse)
  @Expose()
  role: AuthRoleResponse | null;
}
