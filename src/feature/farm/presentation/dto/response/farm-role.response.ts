import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class FarmRoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  name: string;
}
