import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { GetRoleDetailsResult } from '@apps/api/role/application';

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

  public static fromResult(result: GetRoleDetailsResult) {
    const response = new RoleDetailsResponse();

    response.role = RoleResponse.fromRole(result.role);
    response.users = result.users.map((user) => RoleUserResponse.fromRoleUser(user));

    return response;
  }
}
