import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';

import { RegisterCommand } from '@app/module/auth/application';

export class RegisterRequest {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly confirmPassword: string;

  toCommand(): RegisterCommand {
    return {
      email: this.email,
      name: this.name,
      password: this.password,
    };
  }
}
