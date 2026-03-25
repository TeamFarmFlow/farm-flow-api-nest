import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { AuthSessionResult } from '@apps/api/auth/application';

import { AuthFarmResponse } from './auth-farm.response';
import { AuthRoleResponse } from './auth-role.response';
import { AuthUserResponse } from './auth-user.response';

export class AuthResponse {
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

  public static fromResult(result: AuthSessionResult) {
    const response = new AuthResponse();

    response.user = AuthUserResponse.fromAuthUser(result.user);
    response.farm = result.farm ? AuthFarmResponse.fromAuthFarm(result.farm) : null;
    response.role = result.role ? AuthRoleResponse.fromAuthRole(result.role) : null;

    return response;
  }
}
