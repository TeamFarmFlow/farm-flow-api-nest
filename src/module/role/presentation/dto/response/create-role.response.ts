import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class CreateRoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;
}
