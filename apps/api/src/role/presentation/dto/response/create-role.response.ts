import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { CreateRoleResult } from '@apps/api/role/application';

export class CreateRoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  public static fromResult(result: CreateRoleResult) {
    const response = new CreateRoleResponse();

    response.id = result.id;

    return response;
  }
}
