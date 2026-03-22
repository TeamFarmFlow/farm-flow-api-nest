import { Module } from '@nestjs/common';

import { AttendanceEntity, AttendanceRepository, FarmUserEntity, FarmUserRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';

import { PayrollService } from './application';
import { PayrollController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([FarmUserEntity, AttendanceEntity], [FarmUserRepository, AttendanceRepository])],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
