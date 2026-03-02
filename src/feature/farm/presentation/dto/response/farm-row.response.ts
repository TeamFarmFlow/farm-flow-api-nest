import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { FarmResponse } from './farm.response';
import { FarmRoleResponse } from './farm-role.response';

export class FarmRowResponse {
  @ApiProperty({ type: FarmResponse })
  @Type(() => FarmResponse)
  @Expose()
  farm: FarmResponse;

  @ApiProperty({ type: FarmRoleResponse })
  @Type(() => FarmRoleResponse)
  @Expose()
  role: FarmRoleResponse;
}
