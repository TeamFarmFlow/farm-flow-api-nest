import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { FarmUser } from '@apps/api/farm/domain';

import { FarmResponse } from './farm.response';
import { FarmRoleResponse } from './farm-role.response';

export class FarmRowResponse {
  @ApiProperty({ type: FarmResponse })
  @Type(() => FarmResponse)
  @Expose()
  farm: FarmResponse;

  @ApiPropertyOptional({ type: FarmRoleResponse })
  @Type(() => FarmRoleResponse)
  @Expose()
  role: FarmRoleResponse | null;

  public static fromFarmUser(farmUser: FarmUser) {
    const response = new FarmRowResponse();

    response.farm = FarmResponse.fromFarm(farmUser.farm);
    response.role = farmUser.role ? FarmRoleResponse.fromFarmRole(farmUser.role) : null;

    return response;
  }
}
