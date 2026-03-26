import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Query } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ParseUuidStringPipe } from '@libs/http';
import { RequiredPermissions } from '@libs/http';
import { PermissionKey } from '@libs/shared';

import { CONTEXT_SERVICE, ContextServicePort } from '@apps/api/context';

import {
  CheckToPayrolledCommandHandler,
  DeletePayrollAttendanceCommandHandler,
  GetPayrollTargetsByUserIdQueryHandler,
  GetPayrollTargetsQueryHandler,
  UpdatePayrollAttendanceCommandHandler,
} from '../application';

import { CheckToPayrolledRequest, GetPayrollTargetsByUserIdRequest, GetPayrollTargetsRequest, UpdatePayrollAttendanceRequest } from './dto/request';
import { PayrollTargetsByUserIdResponse, PayrollTargetsResponse } from './dto/response';

@ApiTags('급여 정산')
@Controller('payrolls')
export class PayrollController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextServicePort,
    private readonly getPayrollTargetsQueryHandler: GetPayrollTargetsQueryHandler,
    private readonly getPayrollTargetsByUserIdQueryHandler: GetPayrollTargetsByUserIdQueryHandler,
    private readonly updatePayrollAttendanceCommandHandler: UpdatePayrollAttendanceCommandHandler,
    private readonly deletePayrollAttendanceCommandHandler: DeletePayrollAttendanceCommandHandler,
    private readonly checkToPayrolledCommandHandler: CheckToPayrolledCommandHandler,
  ) {}

  @RequiredPermissions([PermissionKey.PayrollRead])
  @Get('targets')
  @ApiOperation({ summary: '급여 정산 목록 조회' })
  @ApiOkResponse({ type: PayrollTargetsResponse })
  async getPayrollTargets(@Query() query: GetPayrollTargetsRequest): Promise<PayrollTargetsResponse> {
    return PayrollTargetsResponse.fromResult(await this.getPayrollTargetsQueryHandler.execute(query.toQuery(this.contextService.user)));
  }

  @RequiredPermissions([PermissionKey.PayrollRead])
  @Get('targets/:userId')
  @ApiOperation({ summary: '급여 정산 대상 상세 조회' })
  @ApiOkResponse({ type: PayrollTargetsByUserIdResponse })
  async getPayrollTargetsByUserId(@Param('userId', new ParseUuidStringPipe()) userId: string, @Query() query: GetPayrollTargetsByUserIdRequest) {
    return PayrollTargetsByUserIdResponse.fromResult(await this.getPayrollTargetsByUserIdQueryHandler.execute(query.toQuery(userId, this.contextService.user)));
  }

  @RequiredPermissions([PermissionKey.PayrollAttendanceHistoryUpdate])
  @Patch(':userId/attendance/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '급여 정산 대상 출퇴근 기록 변경' })
  @ApiNoContentResponse()
  async updatePayrollAttendance(
    @Param('userId', new ParseUuidStringPipe()) userId: string,
    @Param('id', new ParseUuidStringPipe()) id: string,
    @Body() body: UpdatePayrollAttendanceRequest,
  ) {
    return this.updatePayrollAttendanceCommandHandler.execute(body.toCommand(id, userId, this.contextService.user));
  }

  @RequiredPermissions([PermissionKey.PayrollAttendanceHistoryDelete])
  @Delete(':userId/attendance/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '급여 정산 대상 출퇴근 기록 삭제' })
  @ApiNoContentResponse()
  async deletePayrollAttendance(@Param('userId', new ParseUuidStringPipe()) userId: string, @Param('id', new ParseUuidStringPipe()) id: string) {
    return this.deletePayrollAttendanceCommandHandler.execute({ id, userId, farmId: this.contextService.user.farmId });
  }

  @RequiredPermissions([PermissionKey.PayrollCheck])
  @Patch(':userId/check')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '급여 정산 완료 처리' })
  @ApiNoContentResponse()
  async checkToPayrolled(@Param('userId', new ParseUuidStringPipe()) userId: string, @Body() body: CheckToPayrolledRequest) {
    return this.checkToPayrolledCommandHandler.execute(body.toCommand(userId, this.contextService.user));
  }
}
