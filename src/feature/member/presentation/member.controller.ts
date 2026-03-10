import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { ParseUuidStringPipe } from '@app/core/pipes';
import { RequiredPermissions } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';

import { MemberService } from '../application';

import { GetMembersRequest, UpdateMemberRoleRequest } from './dto/request';
import { MembersResponse } from './dto/response';

@ApiTags('멤버')
@Controller('members')
export class MemberController {
  constructor(
    private readonly contextService: ContextService,
    private readonly memberService: MemberService,
  ) {}

  @RequiredPermissions([PermissionKey.MemberRead])
  @Get()
  @ApiOperation({ summary: '농장 멤버 조회' })
  @ApiOkResponse({ type: MembersResponse })
  async getMembers(@Query() query: GetMembersRequest) {
    return toInstance(MembersResponse, await this.memberService.getMembers(query.toQuery(this.contextService.farmId)));
  }

  @RequiredPermissions([PermissionKey.MemberRoleUpdate])
  @Patch(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 멤버 역할 변경' })
  @ApiNoContentResponse()
  async updateMemberRole(@Param('userId', new ParseUuidStringPipe()) userId: string, @Body() body: UpdateMemberRoleRequest) {
    return this.memberService.updateMemberRole(body.toCommand(this.contextService.farmId, userId));
  }

  @RequiredPermissions([PermissionKey.MemberRemove])
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 멤버 제거' })
  @ApiNoContentResponse()
  async removeMember(@Param('userId', new ParseUuidStringPipe()) userId: string) {
    return this.memberService.removeMember({ userId, farmId: this.contextService.farmId });
  }
}
