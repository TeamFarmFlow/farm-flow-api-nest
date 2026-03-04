import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { ParseUuidStringPipe } from '@app/core/pipes';
import { RequiredPermissions } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';
import { AuthFarmPrincipal } from '@app/shared/security';

import { RoleService } from '../application';

import { CreateRoleRequest, UpdateRoleRequest } from './dto/request';
import { GetRolesRequest } from './dto/request/get-roles.request';
import { CreateRoleResponse, RoleDetailsResponse, RolesResponse } from './dto/response';

@RequiredPermissions([PermissionKey.RoleManagement])
@ApiTags('역할/권한')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly contextService: ContextService<AuthFarmPrincipal>,
    private readonly roleService: RoleService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: '역할 상세 조회' })
  @ApiOkResponse({ type: RoleDetailsResponse })
  async getRoleDetails(@Param('id', new ParseUuidStringPipe()) id: string) {
    return toInstance(RoleDetailsResponse, await this.roleService.getRoleDetails(id));
  }

  @Get()
  @ApiOperation({ summary: '역할 목록 조회' })
  @ApiOkResponse({ type: RolesResponse })
  async getRoles(): Promise<RolesResponse> {
    return toInstance(RolesResponse, await this.roleService.getRoles(new GetRolesRequest().toQuery(this.contextService.user.farmId)));
  }

  @Post()
  @ApiOperation({ summary: '역할 생성' })
  @ApiCreatedResponse({ type: CreateRoleResponse })
  async createRole(@Body() body: CreateRoleRequest): Promise<CreateRoleResponse> {
    return toInstance(CreateRoleResponse, await this.roleService.createRole(body.toCommand(this.contextService.user.farmId)));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '역할 수정' })
  @ApiNoContentResponse()
  async updateRole(@Param('id', new ParseUuidStringPipe()) id: string, @Body() body: UpdateRoleRequest): Promise<void> {
    return this.roleService.updateRole(body.toCommand(id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '역할 삭제' })
  @ApiNoContentResponse()
  async deleteRole(@Param('id', new ParseUuidStringPipe()) id: string) {
    return this.roleService.deleteRole(id);
  }
}
