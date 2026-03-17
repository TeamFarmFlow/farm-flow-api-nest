import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';

import { MeService } from '../application';

import { UpdateMyProfileRequest } from './dto/request';

@ApiTags('내 정보')
@Controller('me')
export class MeController {
  constructor(
    private readonly contextService: ContextService,
    private readonly meService: MeService,
  ) {}

  @Patch('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '내 프로필 수정' })
  @ApiNoContentResponse()
  async updateMyProfile(@Body() body: UpdateMyProfileRequest) {
    return this.meService.updateMyProfile(body.toCommand(this.contextService.userId));
  }
}
