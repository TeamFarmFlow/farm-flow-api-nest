import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ParseUuidStringPipe } from '@libs/http';
import { RequiredPermissions } from '@libs/http';
import { toInstance } from '@libs/http';
import { PermissionKey } from '@libs/shared';

import { ContextService } from '@apps/api/context';

import { DeletePayrollAttendanceCommandHandler, GetPayrollsByUserIdQueryHandler, GetPayrollsQueryHandler, UpdatePayrollAttendanceCommandHandler } from '../application';

import { GetPayrollsByUserIdRequest, GetPayrollsRequest, UpdatePayrollAttendanceRequest } from './dto/request';
import { PayrollsByUserIdResponse, PayrollsResponse } from './dto/response';

@ApiTags('급여 정산')
@Controller('payrolls')
export class PayrollController {
  constructor(
    private readonly contextService: ContextService,
    private readonly getPayrollsQueryHandler: GetPayrollsQueryHandler,
    private readonly getPayrollsByUserIdQueryHandler: GetPayrollsByUserIdQueryHandler,
    private readonly updatePayrollAttendanceCommandHandler: UpdatePayrollAttendanceCommandHandler,
    private readonly deletePayrollAttendanceCommandHandler: DeletePayrollAttendanceCommandHandler,
  ) {}

  @RequiredPermissions([PermissionKey.PayrollRead])
  @Get()
  @ApiOperation({ summary: '급여 정산 목록 조회' })
  @ApiOkResponse({ type: PayrollsResponse })
  async getPayrolls(@Query() query: GetPayrollsRequest): Promise<PayrollsResponse> {
    return toInstance(PayrollsResponse, await this.getPayrollsQueryHandler.execute(query.toQuery(this.contextService.farmId)));
  }

  @RequiredPermissions([PermissionKey.PayrollRead])
  @Get(':userId')
  @ApiOperation({ summary: '급여 정산 대상 목록 조회' })
  @ApiOkResponse({ type: PayrollsByUserIdResponse })
  async getPayrollsByUserId(@Param('userId', new ParseUuidStringPipe()) userId: string, @Query() query: GetPayrollsByUserIdRequest) {
    return toInstance(PayrollsByUserIdResponse, await this.getPayrollsByUserIdQueryHandler.execute(query.toQuery(userId, this.contextService.farmId)));
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
    return this.updatePayrollAttendanceCommandHandler.execute(body.toCommand(id, userId, this.contextService.farmId));
  }

  @RequiredPermissions([PermissionKey.PayrollAttendanceHistoryDelete])
  @Delete(':userId/attendance/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '급여 정산 대상 출퇴근 기록 삭제' })
  @ApiNoContentResponse()
  async deletePayrollAttendance(@Param('userId', new ParseUuidStringPipe()) userId: string, @Param('id', new ParseUuidStringPipe()) id: string) {
    return this.deletePayrollAttendanceCommandHandler.execute({ id, userId, farmId: this.contextService.farmId });
  }

  @RequiredPermissions([PermissionKey.PayrollCheck])
  @Patch(':userId/check')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '급여 정산 완료 처리' })
  @ApiNoContentResponse()
  async checkToPayrolled() {}
}
