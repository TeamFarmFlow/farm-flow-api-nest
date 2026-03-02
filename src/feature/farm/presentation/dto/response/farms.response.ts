import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { FarmResponse } from './farm.response';

export class FarmsResponse {
  @ApiProperty({ type: Number })
  @Expose()
  total: number;

  @ApiProperty({ type: [FarmResponse] })
  @Type(() => FarmResponse)
  @Expose()
  rows: FarmResponse[];
}
