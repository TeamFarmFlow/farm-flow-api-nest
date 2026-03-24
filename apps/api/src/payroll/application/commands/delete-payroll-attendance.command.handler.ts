import { Inject, Injectable } from '@nestjs/common';

import { PAYROLL_ATTENDANCE_REPOSITORY, PayrollAttendanceRepositoryPort } from '../ports';

import { DeletePayrollAttendanceCommand } from './delete-payroll-attendance.command';

@Injectable()
export class DeletePayrollAttendanceCommandHandler {
  constructor(
    @Inject(PAYROLL_ATTENDANCE_REPOSITORY)
    private readonly payrollAttendanceRepository: PayrollAttendanceRepositoryPort,
  ) {}

  async execute(command: DeletePayrollAttendanceCommand): Promise<void> {
    await this.payrollAttendanceRepository.delete(command.id, command.farmId, command.userId);
  }
}
