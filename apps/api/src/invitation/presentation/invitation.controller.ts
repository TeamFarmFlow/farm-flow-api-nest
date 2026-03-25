import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequiredPermissions, SkipFarmAuth } from '@libs/http';
import { PermissionKey } from '@libs/shared';

import { CONTEXT_SERVICE, ContextServicePort } from '@apps/api/context';

import { CreateInvitationCommandHandler, ValidateInvitationCodeCommandHandler } from '../application';

import { CreateInvitationRequest, ValidateInvitationCodeRequest } from './dto/request';
import { ValidateInvitationCodeResponse } from './dto/response';

@ApiTags('초대장')
@Controller('invitations')
export class InvitationController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextServicePort,
    private readonly createInvitationCommandHandler: CreateInvitationCommandHandler,
    private readonly validateInvitationCodeCommandHandler: ValidateInvitationCodeCommandHandler,
  ) {}

  @RequiredPermissions([PermissionKey.InvitationCreate])
  @Post()
  @ApiOperation({ summary: '초대장 발급' })
  @ApiCreatedResponse()
  async createInvitation(@Body() body: CreateInvitationRequest): Promise<void> {
    return this.createInvitationCommandHandler.execute(body.toCommand(this.contextService.user));
  }

  @SkipFarmAuth()
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '초대장 사용' })
  @ApiOkResponse({ type: ValidateInvitationCodeResponse })
  async validateInvitationCode(@Body() body: ValidateInvitationCodeRequest): Promise<ValidateInvitationCodeResponse> {
    return ValidateInvitationCodeResponse.fromResult(await this.validateInvitationCodeCommandHandler.execute(body.toCommand(this.contextService.user)));
  }
}
