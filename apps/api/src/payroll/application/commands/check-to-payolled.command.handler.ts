import { Inject, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { PayrollMemberNotFoundException } from '../../domain';
import {
  PAYROLL_ATTENDANCE_REPOSITORY,
  PAYROLL_FARM_USER_REPOSITORY,
  PAYROLL_REPOSITORY,
  PayrollAttendanceRepositoryPort,
  PayrollFarmUserRepositoryPort,
  PayrollRepositoryPort,
} from '../ports';

import { CheckToPayrolledCommand } from './check-to-payolled.command';

@Injectable()
export class CheckToPayrolledCommandHandler {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(PAYROLL_REPOSITORY)
    private readonly payrollRepository: PayrollRepositoryPort,
    @Inject(PAYROLL_FARM_USER_REPOSITORY)
    private readonly payrollFarmUserRepository: PayrollFarmUserRepositoryPort,
    @Inject(PAYROLL_ATTENDANCE_REPOSITORY)
    private readonly payrollAttendanceRepository: PayrollAttendanceRepositoryPort,
  ) {}

  async execute(command: CheckToPayrolledCommand): Promise<void> {
    const farmUser = await this.payrollFarmUserRepository.findOne(command.farmId, command.userId);

    if (!farmUser) {
      throw new PayrollMemberNotFoundException();
    }

    const attendances = await this.payrollAttendanceRepository.findUnpayrolledByFarmIdAndUserIdAndDateRange(command.farmId, command.userId, command.startDate, command.endDate);
    const attendanceTargetIds = attendances.map(({ id }) => id);

    if (attendanceTargetIds.length === 0) {
      // TODO 정산 대상이 없습니다.
      return;
    }

    let totalSeconds = 0;

    await this.dataSource.transaction(async (em) => {
      for (const id of attendanceTargetIds) {
        const { seconds } = await this.payrollAttendanceRepository.updatePayrolled(id, em);
        totalSeconds += seconds;
      }

      await this.payrollRepository.insert(
        {
          farmId: command.farmId,
          userId: command.userId,
          startDate: command.startDate,
          endDate: command.endDate,
          totalSeconds,
          totalPaymentAmount: Math.floor((totalSeconds * farmUser.payRatePerHour) / 3600),
          totalDeductionAmount: farmUser.payDeductionAmount,
        },
        em,
      );
    });
  }
}
