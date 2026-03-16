import { Module } from '@nestjs/common';

import { Attendance, AttendanceRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';

import { PayrollService } from './application';
import { PayrollController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([Attendance], [AttendanceRepository])],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
