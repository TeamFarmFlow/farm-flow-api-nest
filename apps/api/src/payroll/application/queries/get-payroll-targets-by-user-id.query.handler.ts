import { Inject, Injectable } from '@nestjs/common';

import { PayrollMemberNotFoundException } from '../../domain';
import { PAYROLL_ATTENDANCE_REPOSITORY, PAYROLL_FARM_USER_REPOSITORY, PayrollAttendanceRepositoryPort, PayrollFarmUserRepositoryPort } from '../ports';
import { GetPayrollTargetsByUserIdResult } from '../results';

import { GetPayrollTargetsByUserIdQuery } from './get-payroll-targets-by-user-id.query';

@Injectable()
export class GetPayrollTargetsByUserIdQueryHandler {
  constructor(
    @Inject(PAYROLL_FARM_USER_REPOSITORY)
    private readonly payrollFarmUserRepository: PayrollFarmUserRepositoryPort,
    @Inject(PAYROLL_ATTENDANCE_REPOSITORY)
    private readonly payrollAttendanceRepository: PayrollAttendanceRepositoryPort,
  ) {}

  async execute(query: GetPayrollTargetsByUserIdQuery): Promise<GetPayrollTargetsByUserIdResult> {
    const farmUser = await this.payrollFarmUserRepository.findOne(query.farmId, query.userId);

    if (!farmUser) {
      throw new PayrollMemberNotFoundException();
    }

    const rows = await this.payrollAttendanceRepository.findPayrollTargetsByFarmIdAndUserIdAndDateRange(query.farmId, query.userId, query.startDate, query.endDate);

    return {
      total: rows.length,
      payRatePerHour: farmUser.payRatePerHour,
      payDeductionAmount: farmUser.payDeductionAmount,
      rows,
    };
  }
}
