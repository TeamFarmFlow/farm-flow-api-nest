import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ParseUuidStringPipe } from '@libs/http';
import { RequiredPermissions } from '@libs/http';
import { toInstance } from '@libs/http';
import { PermissionKey } from '@libs/shared';

import { ContextService } from '@apps/api/context';

import { GetMembersQueryHandler, RemoveMemberCommandHandler, UpdateMemberCommandHandler } from '../application';

import { GetMembersRequest, UpdateMemberRequest } from './dto/request';
import { MembersResponse } from './dto/response';

@ApiTags('멤버')
@Controller('members')
export class MemberController {
  constructor(
    private readonly contextService: ContextService,
    private readonly getMembersQueryHandler: GetMembersQueryHandler,
    private readonly updateMemberCommandHandler: UpdateMemberCommandHandler,
    private readonly removeMemberCommandHandler: RemoveMemberCommandHandler,
  ) {}

  @RequiredPermissions([PermissionKey.MemberRead])
  @Get()
  @ApiOperation({ summary: '농장 멤버 조회' })
  @ApiOkResponse({ type: MembersResponse })
  async getMembers(@Query() query: GetMembersRequest) {
    return toInstance(MembersResponse, await this.getMembersQueryHandler.execute(query.toQuery(this.contextService.farmId)));
  }

  @RequiredPermissions([PermissionKey.MemberRoleUpdate, PermissionKey.MemberPayUpdate])
  @Patch(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 멤버 정보 수정' })
  @ApiNoContentResponse()
  async updateMember(@Param('userId', new ParseUuidStringPipe()) userId: string, @Body() body: UpdateMemberRequest) {
    return this.updateMemberCommandHandler.execute(body.toCommand(this.contextService.farmId, userId));
  }

  @RequiredPermissions([PermissionKey.MemberRemove])
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '농장 멤버 제거' })
  @ApiNoContentResponse()
  async removeMember(@Param('userId', new ParseUuidStringPipe()) userId: string) {
    return this.removeMemberCommandHandler.execute({ userId, farmId: this.contextService.farmId });
  }
}
