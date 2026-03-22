import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { RequiredPermissions, SkipFarmAuth } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';

import { CreateInvitationCommandHandler, ValidateInvitationCodeCommandHandler } from '../application';

import { CreateInvitationRequest, ValidateInvitationCodeRequest } from './dto/request';
import { ValidateInvitationCodeResponse } from './dto/response';

@ApiTags('초대장')
@Controller('invitations')
export class InvitationController {
  constructor(
    private readonly contextService: ContextService,
    private readonly createInvitationCommandHandler: CreateInvitationCommandHandler,
    private readonly validateInvitationCodeCommandHandler: ValidateInvitationCodeCommandHandler,
  ) {}

  @RequiredPermissions([PermissionKey.InvitationCreate])
  @Post()
  @ApiOperation({ summary: '초대장 발급' })
  @ApiCreatedResponse()
  async createInvitation(@Body() body: CreateInvitationRequest): Promise<void> {
    return this.createInvitationCommandHandler.execute(body.toCommand(this.contextService.farmId));
  }

  @SkipFarmAuth()
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '초대장 사용' })
  @ApiOkResponse({ type: ValidateInvitationCodeResponse })
  async validateInvitationCode(@Body() body: ValidateInvitationCodeRequest): Promise<ValidateInvitationCodeResponse> {
    return toInstance(ValidateInvitationCodeResponse, await this.validateInvitationCodeCommandHandler.execute(body.toCommand(this.contextService.userId)));
  }
}
