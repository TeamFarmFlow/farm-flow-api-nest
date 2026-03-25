import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { CreateFarmResult } from '@apps/api/farm/application';

export class CreateFarmResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  public static fromResult(result: CreateFarmResult) {
    const response = new CreateFarmResponse();

    response.id = result.id;

    return response;
  }
}
