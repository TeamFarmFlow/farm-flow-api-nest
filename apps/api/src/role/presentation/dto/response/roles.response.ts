import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetRolesResult } from '@apps/api/role/application';

import { RoleResponse } from './role.response';

export class RolesResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [RoleResponse] })
  @Type(() => RoleResponse)
  @Expose()
  rows: RoleResponse[];

  public static fromResult(result: GetRolesResult) {
    const response = new RolesResponse();

    response.total = result.total;
    response.rows = result.rows.map((row) => RoleResponse.fromRole(row));

    return response;
  }
}
