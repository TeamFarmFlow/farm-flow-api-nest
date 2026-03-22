import { Inject, Injectable } from '@nestjs/common';

import { PayrollMemberNotFoundException } from '../../domain';
import { PAYROLL_ATTENDANCE_REPOSITORY, PAYROLL_FARM_USER_REPOSITORY, PayrollAttendanceRepositoryPort, PayrollFarmUserRepositoryPort } from '../ports';
import { GetPayrollsByUserIdResult } from '../results';

import { GetPayrollsByUserIdQuery } from './get-payrolls-by-user-id.query';

@Injectable()
export class GetPayrollsByUserIdQueryHandler {
  constructor(
    @Inject(PAYROLL_FARM_USER_REPOSITORY)
    private readonly payrollFarmUserRepository: PayrollFarmUserRepositoryPort,
    @Inject(PAYROLL_ATTENDANCE_REPOSITORY)
    private readonly payrollAttendanceRepository: PayrollAttendanceRepositoryPort,
  ) {}

  async execute(query: GetPayrollsByUserIdQuery): Promise<GetPayrollsByUserIdResult> {
    const farmUser = await this.payrollFarmUserRepository.findOne(query.farmId, query.userId);

    if (!farmUser) {
      throw new PayrollMemberNotFoundException();
    }

    const rows = await this.payrollAttendanceRepository.findPayrollAttendancesByFarmIdAndUserIdAndDateRange(query.farmId, query.userId, query.startDate, query.endDate);

    return {
      total: rows.length,
      payRatePerHour: farmUser.payRatePerHour,
      payDeductionAmount: farmUser.payDeductionAmount,
      rows,
    };
  }
}
