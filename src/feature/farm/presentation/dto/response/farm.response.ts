import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class FarmResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;
}
