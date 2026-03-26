import { Inject, Injectable } from '@nestjs/common';

import { PAYROLL_ATTENDANCE_REPOSITORY, PayrollAttendanceRepositoryPort } from '../ports';
import { GetPayrollTargetsResult } from '../results';

import { GetPayrollTargetsQuery } from './get-payroll-targets.query';

@Injectable()
export class GetPayrollTargetsQueryHandler {
  constructor(
    @Inject(PAYROLL_ATTENDANCE_REPOSITORY)
    private readonly payrollAttendanceRepository: PayrollAttendanceRepositoryPort,
  ) {}

  async execute(query: GetPayrollTargetsQuery): Promise<GetPayrollTargetsResult> {
    const rows = await this.payrollAttendanceRepository.findPayrollTargetsByFarmIdAndDateRange(query.farmId, query.startDate, query.endDate);

    return {
      total: rows.length,
      rows,
    };
  }
}
