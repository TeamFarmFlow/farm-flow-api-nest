import { Injectable } from '@nestjs/common';

import { AttendanceRepository, FarmUserRepository } from '@app/infra/persistence/typeorm';

import { PayrollMemberNotFoundException } from '../domain';

import { DeletePayrollAttendanceCommand, UpdatePayrollAttendanceCommand } from './commands';
import { GetPayrollsByUserIdQuery, GetPayrollsQuery } from './queries';
import { GetPayrollsByUserIdResult, GetPayrollsResult } from './results';

@Injectable()
export class PayrollService {
  constructor(
    private readonly farmUserRepository: FarmUserRepository,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

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
        needCheck: row.need_check,
      })),
    };
  }

  async getPayrollsByUserId(query: GetPayrollsByUserIdQuery): Promise<GetPayrollsByUserIdResult> {
    const farmUser = await this.farmUserRepository.findOne(query.farmId, query.userId);

    if (!farmUser) {
      throw new PayrollMemberNotFoundException();
    }

    const rows = await this.attendanceRepository.findPayrollsByFarmIdAndUserIdAndDateRange(query.farmId, query.userId, query.startDate, query.endDate);

    return {
      total: rows.length,
      payRatePerHour: farmUser.payRatePerHour,
      payDeductionAmount: farmUser.payDeductionAmount,
      rows,
    };
  }

  async updatePayrollAttendance(command: UpdatePayrollAttendanceCommand): Promise<void> {
    await this.attendanceRepository.update(command.id, command.farmId, command.userId, command.checkedInAt, command.checkedOutAt);
  }

  async deletePayrollAttendance(command: DeletePayrollAttendanceCommand): Promise<void> {
    await this.attendanceRepository.delete(command.id, command.userId, command.farmId);
  }
}
