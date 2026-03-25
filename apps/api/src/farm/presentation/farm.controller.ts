import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ParseUuidStringPipe } from '@libs/http';
import { RequiredPermissions, SkipFarmAuth } from '@libs/http';
import { PermissionKey } from '@libs/shared';

import { CONTEXT_SERVICE, ContextServicePort } from '@apps/api/context';

import { CreateFarmCommandHandler, DeleteFarmCommandHandler, GetFarmQueryHandler, GetFarmsQueryHandler, UpdateFarmCommandHandler } from '../application';

import { CreateFarmRequest, GetFarmsRequest, UpdateFarmRequest } from './dto/request';
import { CreateFarmResponse, FarmResponse, FarmsResponse } from './dto/response';

@SkipFarmAuth()
@ApiTags('농장')
@Controller('farms')
export class FarmController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextServicePort,
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
    return FarmsResponse.fromResult(await this.getFarmsQueryHandler.execute(new GetFarmsRequest().toQuery(this.contextService.user)));
  }

  @Get(':id')
  @ApiOperation({ summary: '농장 정보 조회' })
  @ApiOkResponse({ type: FarmResponse })
  async getFarm(@Param('id', new ParseUuidStringPipe()) farmId: string) {
    return FarmResponse.fromFarm(await this.getFarmQueryHandler.execute({ farmId, userId: this.contextService.user.userId }));
  }

  @Post()
  @ApiOperation({ summary: '농장 생성' })
  @ApiCreatedResponse({ type: CreateFarmResponse })
  async createFarm(@Body() body: CreateFarmRequest): Promise<CreateFarmResponse> {
    return CreateFarmResponse.fromResult(await this.createFarmCommandHandler.execute(body.toCommand(this.contextService.user)));
  }

  @RequiredPermissions([PermissionKey.FarmUpdate])
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 수정' })
  @ApiNoContentResponse()
  async updateFarm(@Param('id', new ParseUuidStringPipe()) farmId: string, @Body() body: UpdateFarmRequest) {
    return this.updateFarmCommandHandler.execute(body.toCommand(farmId, this.contextService.user));
  }

  @RequiredPermissions([PermissionKey.FarmDelete])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 삭제' })
  @ApiNoContentResponse()
  async deleteFarm(@Param('id', new ParseUuidStringPipe()) farmId: string) {
    return this.deleteFarmCommandHandler.execute({ farmId, userId: this.contextService.user.userId });
  }
}
