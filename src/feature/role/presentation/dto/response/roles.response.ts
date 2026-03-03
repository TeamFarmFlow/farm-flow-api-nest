import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { RoleResponse } from './role.response';

export class RolesResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [RoleResponse] })
  @Type(() => RoleResponse)
  @Expose()
  rows: RoleResponse[];
}
