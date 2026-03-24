import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { RoleResponse } from './role.response';
import { RoleUserResponse } from './role-user.response';

export class RoleDetailsResponse {
  @ApiProperty({ type: RoleResponse })
  @Type(() => RoleResponse)
  @Expose()
  role: RoleResponse;

  @ApiProperty({ type: [RoleUserResponse] })
  @Type(() => RoleUserResponse)
  @Expose()
  users: RoleUserResponse[];
}
