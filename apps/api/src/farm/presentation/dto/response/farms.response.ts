import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetFarmsResult } from '@apps/api/farm/application';

import { FarmRowResponse } from './farm-row.response';

export class FarmsResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [FarmRowResponse] })
  @Type(() => FarmRowResponse)
  @Expose()
  rows: FarmRowResponse[];

  public static fromResult(result: GetFarmsResult) {
    const response = new FarmsResponse();

    response.total = result.total;
    response.rows = response.rows.map((row) => FarmRowResponse.fromFarmUser(row));

    return response;
  }
}
