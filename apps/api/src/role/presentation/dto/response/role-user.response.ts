import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class RoleUserResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: String, format: 'email' })
  @Expose()
  email: string;
}
