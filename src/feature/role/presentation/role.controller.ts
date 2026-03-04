import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { ParseUuidStringPipe } from '@app/core/pipes';
import { RequiredPermissions } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';
import { AuthFarmPrincipal } from '@app/shared/security';

import { RoleService } from '../application';

import { CreateRoleRequest, UpdateRoleRequest } from './dto/request';
import { GetRolesRequest } from './dto/request/get-roles.request';
import { RolesResponse } from './dto/response';

@RequiredPermissions([PermissionKey.RoleManagement])
@ApiTags('역할/권한')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly contextService: ContextService<AuthFarmPrincipal>,
    private readonly roleService: RoleService,
  ) {}

  @Get()
  @ApiOperation({ summary: '역할 목록 조회' })
  @ApiOkResponse({ type: RolesResponse })
  async getRoles() {
    return toInstance(RolesResponse, await this.roleService.getRoles(new GetRolesRequest().toQuery(this.contextService.user.farmId)));
  }

  @Post()
  @ApiOperation({ summary: '역할 생성' })
  @ApiCreatedResponse()
  async createRole(@Body() body: CreateRoleRequest) {
    return this.roleService.createRole(body.toCommand(this.contextService.user.farmId));
  }

  @Patch(':id')
  @ApiOperation({ summary: '역할 수정' })
  @ApiCreatedResponse()
  async updateRole(@Param('id', new ParseUuidStringPipe()) id: string, @Body() body: UpdateRoleRequest) {
    return this.roleService.updateRole(body.toCommand(id));
  }
}
