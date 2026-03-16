import { Injectable } from '@nestjs/common';

import { AttendanceRepository } from '@app/infra/persistence/typeorm';

import { GetPayrollsQuery } from './queries';
import { GetPayrollsResult } from './results';

@Injectable()
export class PayrollService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async getPayrolls(query: GetPayrollsQuery): Promise<GetPayrollsResult> {
    const rows = await this.attendanceRepository.findPayrollsByFarmIdAndDateRange(query.farmId, query.startDate, query.endDate);

    return {
      total: rows.length,
      rows: rows.map((row) => ({
        user: {
          id: row.user_id,
          name: row.user_name,
        },
        role: row.role_id
          ? {
              id: row.role_id,
              name: row.role_name!,
              super: row.role_super!,
              required: row.role_required!,
            }
          : null,
        payRatePerHour: row.pay_rate_per_hour,
        payDeductionAmount: row.pay_deduction_amount,
        seconds: Number(row.seconds),
      })),
    };
  }
}
