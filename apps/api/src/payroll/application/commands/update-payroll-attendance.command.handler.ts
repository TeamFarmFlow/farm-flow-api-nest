import { Inject, Injectable } from '@nestjs/common';

import { PAYROLL_ATTENDANCE_REPOSITORY, PayrollAttendanceRepositoryPort } from '../ports';

import { UpdatePayrollAttendanceCommand } from './update-payroll-attendance.command';

@Injectable()
export class UpdatePayrollAttendanceCommandHandler {
  constructor(
    @Inject(PAYROLL_ATTENDANCE_REPOSITORY)
    private readonly payrollAttendanceRepository: PayrollAttendanceRepositoryPort,
  ) {}

  async execute(command: UpdatePayrollAttendanceCommand): Promise<void> {
    await this.payrollAttendanceRepository.update(command.id, command.farmId, command.userId, command.checkedInAt, command.checkedOutAt);
  }
}
