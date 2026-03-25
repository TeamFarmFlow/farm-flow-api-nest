import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ParseUuidStringPipe, RequiredPermissions } from '@libs/http';
import { PermissionKey } from '@libs/shared';

import { ContextService } from '@apps/api/context';

import { CreateRoleCommandHandler, DeleteRoleCommandHandler, GetRoleDetailsQueryHandler, GetRolesQueryHandler, UpdateRoleCommandHandler } from '../application';

import { CreateRoleRequest, UpdateRoleRequest } from './dto/request';
import { GetRolesRequest } from './dto/request/get-roles.request';
import { CreateRoleResponse, RoleDetailsResponse, RolesResponse } from './dto/response';

@ApiTags('역할/권한')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly contextService: ContextService,
    private readonly getRoleDetailsQueryHandler: GetRoleDetailsQueryHandler,
    private readonly getRolesQueryHandler: GetRolesQueryHandler,
    private readonly createRoleCommandHandler: CreateRoleCommandHandler,
    private readonly updateRoleCommandHandler: UpdateRoleCommandHandler,
    private readonly deleteRoleCommandHandler: DeleteRoleCommandHandler,
  ) {}

  @RequiredPermissions([PermissionKey.RoleRead])
  @Get(':id')
  @ApiOperation({ summary: '역할 상세 조회' })
  @ApiOkResponse({ type: RoleDetailsResponse })
  async getRoleDetails(@Param('id', new ParseUuidStringPipe()) id: string) {
    return RoleDetailsResponse.fromResult(await this.getRoleDetailsQueryHandler.execute({ roleId: id }));
  }

  @RequiredPermissions([PermissionKey.RoleRead])
  @Get()
  @ApiOperation({ summary: '역할 목록 조회' })
  @ApiOkResponse({ type: RolesResponse })
  async getRoles(): Promise<RolesResponse> {
    return RolesResponse.fromResult(await this.getRolesQueryHandler.execute(new GetRolesRequest().toQuery(this.contextService.farmId)));
  }

  @RequiredPermissions([PermissionKey.RoleCreate])
  @Post()
  @ApiOperation({ summary: '역할 생성' })
  @ApiCreatedResponse({ type: CreateRoleResponse })
  async createRole(@Body() body: CreateRoleRequest): Promise<CreateRoleResponse> {
    return CreateRoleResponse.fromResult(await this.createRoleCommandHandler.execute(body.toCommand(this.contextService.farmId)));
  }

  @RequiredPermissions([PermissionKey.RoleUpdate])
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '역할 수정' })
  @ApiNoContentResponse()
  async updateRole(@Param('id', new ParseUuidStringPipe()) id: string, @Body() body: UpdateRoleRequest): Promise<void> {
    return this.updateRoleCommandHandler.execute(body.toCommand(id));
  }

  @RequiredPermissions([PermissionKey.RoleRemove])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '역할 삭제' })
  @ApiNoContentResponse()
  async deleteRole(@Param('id', new ParseUuidStringPipe()) id: string) {
    return this.deleteRoleCommandHandler.execute({ roleId: id });
  }
}
