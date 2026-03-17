import { Module } from '@nestjs/common';

import { Attendance, AttendanceRepository, FarmUser, FarmUserRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';

import { PayrollService } from './application';
import { PayrollController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([FarmUser, Attendance], [FarmUserRepository, AttendanceRepository])],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
