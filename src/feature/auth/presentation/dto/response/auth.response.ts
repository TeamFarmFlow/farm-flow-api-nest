import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { AuthResult } from '@app/feature/auth/application/result';
import { User } from '@app/infra/persistence/typeorm';
import { UserStatus, UserType } from '@app/shared/domain';

class AuthUser {
  @ApiProperty({ enum: UserType })
  @Expose()
  type: UserType;

  @ApiProperty({ type: String })
  @Expose()
  email: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ enum: UserStatus })
  @Expose()
  status: UserStatus;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt: Date;

  public static from(user: User) {
    const response = new AuthUser();

    response.type = user.type;
    response.email = user.email;
    response.name = user.name;
    response.status = user.status;
    response.createdAt = user.createdAt;
    response.updatedAt = user.updatedAt;

    return response;
  }
}

export class AuthResponse {
  @ApiProperty({ type: String })
  @Expose()
  accessToken: string;

  @ApiProperty({ type: Number })
  @Expose()
  expiresIn: number;

  @ApiProperty({ type: Date })
  @Expose()
  expiresAt: Date;

  @ApiProperty({ type: AuthUser })
  @Expose()
  user: AuthUser;

  public static from(result: AuthResult) {
    const response = new AuthResponse();

    response.accessToken = result.accessToken;
    response.expiresAt = result.expiresAt;
    response.expiresIn = result.expiresIn;
    response.user = AuthUser.from(result.user);

    return response;
  }
}
