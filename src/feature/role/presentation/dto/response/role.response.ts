import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class RoleResponse {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  super: boolean;

  @ApiProperty({ type: Boolean })
  @Expose()
  required: boolean;

  @ApiProperty({ type: String, isArray: true })
  @Expose()
  permissionKeys: string[];
}
