import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@apps/api/context';

import { UpdateMyProfileCommandHandler } from '../application';

import { UpdateMyProfileRequest } from './dto/request';

@ApiTags('내 정보')
@Controller('me')
export class MeController {
  constructor(
    private readonly contextService: ContextService,
    private readonly updateMyProfileCommandHandler: UpdateMyProfileCommandHandler,
  ) {}

  @Patch('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '내 프로필 수정' })
  @ApiNoContentResponse()
  async updateMyProfile(@Body() body: UpdateMyProfileRequest) {
    return this.updateMyProfileCommandHandler.execute(body.toCommand(this.contextService.userId));
  }
}
