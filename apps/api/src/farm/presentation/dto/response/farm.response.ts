import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { Farm } from '@apps/api/farm/domain';

export class FarmResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Number })
  @Expose()
  payRatePerHour: number;

  @ApiProperty({ type: Number })
  @Expose()
  payDeductionAmount: number;

  public static fromFarm(farm: Farm) {
    const response = new FarmResponse();

    response.id = farm.id;
    response.name = farm.name;
    response.payRatePerHour = farm.payRatePerHour;
    response.payDeductionAmount = farm.payDeductionAmount;

    return response;
  }
}
