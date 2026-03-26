import { Module } from '@nestjs/common';

import {
  CheckToPayrolledCommandHandler,
  DeletePayrollAttendanceCommandHandler,
  GetPayrollTargetsByUserIdQueryHandler,
  GetPayrollTargetsQueryHandler,
  PAYROLL_ATTENDANCE_REPOSITORY,
  PAYROLL_FARM_USER_REPOSITORY,
  PAYROLL_REPOSITORY,
  UpdatePayrollAttendanceCommandHandler,
} from './application';
import { TypeOrmPayrollAttendanceRepository, TypeOrmPayrollFarmUserRepository, TypeOrmPayrollRepository } from './infra';
import { PayrollController } from './presentation';

const repositories = [TypeOrmPayrollRepository, TypeOrmPayrollAttendanceRepository, TypeOrmPayrollFarmUserRepository];
const queryHandlers = [GetPayrollTargetsQueryHandler, GetPayrollTargetsByUserIdQueryHandler];
const commandHandlers = [UpdatePayrollAttendanceCommandHandler, DeletePayrollAttendanceCommandHandler, CheckToPayrolledCommandHandler];

@Module({
  controllers: [PayrollController],
  providers: [
    {
      provide: PAYROLL_REPOSITORY,
      useExisting: TypeOrmPayrollRepository,
    },
    {
      provide: PAYROLL_ATTENDANCE_REPOSITORY,
      useExisting: TypeOrmPayrollAttendanceRepository,
    },
    {
      provide: PAYROLL_FARM_USER_REPOSITORY,
      useExisting: TypeOrmPayrollFarmUserRepository,
    },
    ...repositories,
    ...queryHandlers,
    ...commandHandlers,
  ],
})
export class PayrollModule {}
