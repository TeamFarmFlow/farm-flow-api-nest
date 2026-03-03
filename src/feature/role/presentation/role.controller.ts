import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { RequiredPermissions } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';
import { AuthFarmPrincipal } from '@app/shared/security';

import { RoleService } from '../application';

import { CreateRoleRequest } from './dto/request';
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
}
