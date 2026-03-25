import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { FarmRole } from '@apps/api/farm/domain';

export class FarmRoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  required: boolean;

  @ApiProperty({ type: Boolean })
  @Expose()
  super: boolean;

  public static fromFarmRole(farmRole: FarmRole) {
    const response = new FarmRoleResponse();

    response.id = farmRole.id;
    response.name = farmRole.name;
    response.required = farmRole.required;
    response.super = farmRole.super;

    return response;
  }
}
