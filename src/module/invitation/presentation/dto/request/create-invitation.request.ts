import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

import { CreateInvitationCommand } from '@app/module/invitation/application';

export class CreateInvitationRequest {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, format: 'email' })
  @IsUrl({
    require_port: false,
    require_tld: false,
  })
  @IsNotEmpty()
  readonly url: string;

  toCommand(farmId: string): CreateInvitationCommand {
    return {
      farmId,
      email: this.email,
      url: this.url,
    };
  }
}
