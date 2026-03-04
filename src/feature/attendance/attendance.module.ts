import { Module } from '@nestjs/common';

import {
  Attendance,
  AttendanceQrChallenge,
  AttendanceQrChallengeRepository,
  AttendanceRepository,
  FarmUser,
  FarmUserRepository,
  TypeOrmExModule,
} from '@app/infra/persistence/typeorm';

import { AttendanceQrChallengeService, AttendanceService } from './application';
import { AttendanceController, AttendanceQrChallengeController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([FarmUser, Attendance, AttendanceQrChallenge], [FarmUserRepository, AttendanceRepository, AttendanceQrChallengeRepository])],
  controllers: [AttendanceController, AttendanceQrChallengeController],
  providers: [AttendanceService, AttendanceQrChallengeService],
})
export class AttendanceModule {}
