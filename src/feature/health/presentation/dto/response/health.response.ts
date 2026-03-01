import { ApiProperty } from '@nestjs/swagger';

import { NodeEnv } from '@app/config/enums';
import { HealthResult } from '@app/feature/health/application/result';
import { Expose } from 'class-transformer';

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

  constructor(name: string, version: string, env: NodeEnv) {
    this.name = name;
    this.version = version;
    this.env = env;
  }

  public static from(result: HealthResult) {
    return new HealthResponse(result.name, result.version, result.env);
  }
}
