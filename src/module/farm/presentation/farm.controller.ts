import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { ParseUuidStringPipe } from '@app/core/pipes';
import { RequiredPermissions, SkipFarmAuth } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';

import { CreateFarmCommandHandler, DeleteFarmCommandHandler, GetFarmQueryHandler, GetFarmsQueryHandler, UpdateFarmCommandHandler } from '../application';

import { CreateFarmRequest, GetFarmsRequest, UpdateFarmRequest } from './dto/request';
import { CreateFarmResponse, FarmResponse, FarmsResponse } from './dto/response';

@SkipFarmAuth()
@ApiTags('농장')
@Controller('farms')
export class FarmController {
  constructor(
    private readonly contextService: ContextService,
    private readonly getFarmsQueryHandler: GetFarmsQueryHandler,
    private readonly getFarmQueryHandler: GetFarmQueryHandler,
    private readonly createFarmCommandHandler: CreateFarmCommandHandler,
    private readonly updateFarmCommandHandler: UpdateFarmCommandHandler,
    private readonly deleteFarmCommandHandler: DeleteFarmCommandHandler,
  ) {}

  @Get()
  @ApiOperation({ summary: '내 농장 목록 조회' })
  @ApiOkResponse({ type: FarmsResponse })
  async getFarms() {
    return toInstance(FarmsResponse, await this.getFarmsQueryHandler.execute(new GetFarmsRequest().toQuery(this.contextService.userId)));
  }

  @Get(':id')
  @ApiOperation({ summary: '농장 정보 조회' })
  @ApiOkResponse({ type: FarmResponse })
  async getFarm(@Param('id', new ParseUuidStringPipe()) farmId: string) {
    return toInstance(FarmResponse, await this.getFarmQueryHandler.execute({ farmId, userId: this.contextService.userId }));
  }

  @Post()
  @ApiOperation({ summary: '농장 생성' })
  @ApiCreatedResponse({ type: CreateFarmResponse })
  async createFarm(@Body() body: CreateFarmRequest): Promise<CreateFarmResponse> {
    return toInstance(CreateFarmResponse, await this.createFarmCommandHandler.execute(body.toCommand(this.contextService.userId)));
  }

  @RequiredPermissions([PermissionKey.FarmUpdate])
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 수정' })
  @ApiNoContentResponse()
  async updateFarm(@Param('id', new ParseUuidStringPipe()) farmId: string, @Body() body: UpdateFarmRequest) {
    return this.updateFarmCommandHandler.execute(body.toCommand(farmId, this.contextService.userId));
  }

  @RequiredPermissions([PermissionKey.FarmDelete])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 삭제' })
  @ApiNoContentResponse()
  async deleteFarm(@Param('id', new ParseUuidStringPipe()) farmId: string) {
    return this.deleteFarmCommandHandler.execute({ farmId, userId: this.contextService.userId });
  }
}
