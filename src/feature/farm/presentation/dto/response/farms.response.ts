import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { FarmRowResponse } from './farm-row.response';

export class FarmsResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [FarmRowResponse] })
  @Type(() => FarmRowResponse)
  @Expose()
  rows: FarmRowResponse[];
}
