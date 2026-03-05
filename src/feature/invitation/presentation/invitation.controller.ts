import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { RequiredPermissions, SkipFarmAuth } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';

import { InvitationService } from '../application';

import { CreateInvitationRequest, ValidateInvitationCodeRequest } from './dto/request';
import { CreateInvitationResponse, ValidateInvitationCodeResponse } from './dto/response';

@ApiTags('초대장')
@Controller('invitations')
export class InvitationController {
  constructor(
    private readonly contextService: ContextService,
    private readonly invitationService: InvitationService,
  ) {}

  @RequiredPermissions([PermissionKey.InvitationCreate])
  @Post()
  @ApiOperation({ summary: '초대장 발급' })
  @ApiCreatedResponse({ type: CreateInvitationResponse })
  async createInvitation(@Body() body: CreateInvitationRequest): Promise<CreateInvitationResponse> {
    return toInstance(CreateInvitationResponse, await this.invitationService.createInvitation(body.toCommand(this.contextService.farmId, this.contextService.userId)));
  }

  @SkipFarmAuth()
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '초대장 사용' })
  @ApiOkResponse({ type: ValidateInvitationCodeResponse })
  async validateInvitationCode(@Body() body: ValidateInvitationCodeRequest): Promise<ValidateInvitationCodeResponse> {
    return toInstance(ValidateInvitationCodeResponse, await this.invitationService.validateInvitationCode(body.toCommand(this.contextService.userId)));
  }
}
