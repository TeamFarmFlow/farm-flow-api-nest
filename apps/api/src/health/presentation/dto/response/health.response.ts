import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { NodeEnv } from '@libs/config/enums';

import { Health } from '@apps/api/health/domain';

export class HealthResponse {
  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: String })
  @Expose()
  version: string;

  @ApiProperty({ enum: NodeEnv })
  @Expose()
  env: NodeEnv;

  public static fromHealth(health: Health) {
    const response = new HealthResponse();

    response.name = health.name;
    response.version = health.version;
    response.env = health.env;

    return response;
  }
}
