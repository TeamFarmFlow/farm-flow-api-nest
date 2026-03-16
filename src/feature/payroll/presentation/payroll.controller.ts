import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { RequiredPermissions } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';

import { PayrollService } from '../application';

import { GetPayrollsRequest } from './dto/request';
import { PayrollsResponse } from './dto/response';

@ApiTags('급여 정산')
@Controller('payrolls')
export class PayrollController {
  constructor(
    private readonly contextService: ContextService,
    private readonly payrollService: PayrollService,
  ) {}

  @RequiredPermissions([PermissionKey.PayrollRead])
  @Get()
  @ApiOperation({ summary: '급여 정산 목록 조회' })
  @ApiOkResponse({ type: PayrollsResponse })
  async getPayrolls(@Query() query: GetPayrollsRequest): Promise<PayrollsResponse> {
    return toInstance(PayrollsResponse, await this.payrollService.getPayrolls(query.toQuery(this.contextService.farmId)));
  }
}
