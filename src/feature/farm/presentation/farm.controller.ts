import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { ParseUuidStringPipe } from '@app/core/pipes';
import { RequiredPermissions } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';

import { FarmService } from '../application';

import { CreateFarmRequest, GetFarmsRequest, UpdateFarmRequest } from './dto/request';
import { CreateFarmResponse, FarmResponse, FarmsResponse } from './dto/response';

@ApiTags('농장')
@Controller('farms')
export class FarmController {
  constructor(
    private readonly contextService: ContextService,
    private readonly farmService: FarmService,
  ) {}

  @Get()
  @ApiOperation({ summary: '내 농장 목록 조회' })
  @ApiOkResponse({ type: FarmResponse })
  async getFarms() {
    return toInstance(FarmsResponse, await this.farmService.getFarms(new GetFarmsRequest().toQuery(this.contextService.userId)));
  }

  @Post()
  @ApiOperation({ summary: '농장 생성' })
  @ApiCreatedResponse({ type: CreateFarmResponse })
  async createFarm(@Body() body: CreateFarmRequest): Promise<CreateFarmResponse> {
    return toInstance(CreateFarmResponse, await this.farmService.createFarm(body.toCommand(this.contextService.userId)));
  }

  @RequiredPermissions([PermissionKey.Update])
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 수정' })
  @ApiNoContentResponse()
  async updateFarm(@Param('id', new ParseUuidStringPipe()) farmId: string, @Body() body: UpdateFarmRequest) {
    return this.farmService.updateFarm(body.toCommand(farmId, this.contextService.userId));
  }

  @RequiredPermissions([PermissionKey.Delete])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 삭제' })
  @ApiNoContentResponse()
  async deleteFarm(@Param('id', new ParseUuidStringPipe()) farmId: string) {
    return this.farmService.deleteFarm({ farmId, userId: this.contextService.userId });
  }
}
