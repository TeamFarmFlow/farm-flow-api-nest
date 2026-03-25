import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { RoleUser } from '@apps/api/role/domain';

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

  public static fromRoleUser(roleUser: RoleUser) {
    const response = new RoleUserResponse();

    response.id = roleUser.id;
    response.name = roleUser.name;
    response.email = roleUser.email;

    return response;
  }
}
