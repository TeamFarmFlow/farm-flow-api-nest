import { Module } from '@nestjs/common';

import {
  DeletePayrollAttendanceCommandHandler,
  GetPayrollsByUserIdQueryHandler,
  GetPayrollsQueryHandler,
  PAYROLL_ATTENDANCE_REPOSITORY,
  PAYROLL_FARM_USER_REPOSITORY,
  UpdatePayrollAttendanceCommandHandler,
} from './application';
import { TypeOrmPayrollAttendanceRepository, TypeOrmPayrollFarmUserRepository } from './infra';
import { PayrollController } from './presentation';

const repositories = [TypeOrmPayrollAttendanceRepository, TypeOrmPayrollFarmUserRepository];
const queryHandlers = [GetPayrollsQueryHandler, GetPayrollsByUserIdQueryHandler];
const commandHandlers = [UpdatePayrollAttendanceCommandHandler, DeletePayrollAttendanceCommandHandler];

@Module({
  controllers: [PayrollController],
  providers: [
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
