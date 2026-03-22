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
    GetPayrollsQueryHandler,
    GetPayrollsByUserIdQueryHandler,
    UpdatePayrollAttendanceCommandHandler,
    DeletePayrollAttendanceCommandHandler,
    TypeOrmPayrollAttendanceRepository,
    TypeOrmPayrollFarmUserRepository,
  ],
})
export class PayrollModule {}
