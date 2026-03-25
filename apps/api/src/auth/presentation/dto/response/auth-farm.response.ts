import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { AuthFarm } from '@apps/api/auth/domain';

export class AuthFarmResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  public static fromAuthFarm(authFarm: AuthFarm) {
    const response = new AuthFarmResponse();

    response.id = authFarm.id;
    response.name = authFarm.name;

    return response;
  }
}
