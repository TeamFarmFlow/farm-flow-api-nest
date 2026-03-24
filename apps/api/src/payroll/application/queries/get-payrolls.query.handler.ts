import { Inject, Injectable } from '@nestjs/common';

import { PAYROLL_ATTENDANCE_REPOSITORY, PayrollAttendanceRepositoryPort } from '../ports';
import { GetPayrollsResult } from '../results';

import { GetPayrollsQuery } from './get-payrolls.query';

@Injectable()
export class GetPayrollsQueryHandler {
  constructor(
    @Inject(PAYROLL_ATTENDANCE_REPOSITORY)
    private readonly payrollAttendanceRepository: PayrollAttendanceRepositoryPort,
  ) {}

  async execute(query: GetPayrollsQuery): Promise<GetPayrollsResult> {
    const rows = await this.payrollAttendanceRepository.findPayrollsByFarmIdAndDateRange(query.farmId, query.startDate, query.endDate);

    return {
      total: rows.length,
      rows,
    };
  }
}
