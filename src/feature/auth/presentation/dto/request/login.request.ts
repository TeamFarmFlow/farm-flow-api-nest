import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';

import { LoginCommand } from '@app/feature/auth/application/command';

export class LoginRequest {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly password: string;

  toCommand(): LoginCommand {
    return {
      email: this.email,
      password: this.password,
    };
  }
}
