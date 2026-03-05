import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  Attendance,
  AttendanceQrChallenge,
  AttendanceQrChallengeRepository,
  AttendanceRepository,
  FarmUser,
  FarmUserRepository,
  TypeOrmExModule,
} from '@app/infra/persistence/typeorm';
import { RedisSubscriber } from '@app/infra/redis';

import { AttendanceQrChallengeService, AttendanceService } from './application';
import { AttendanceController, AttendanceQrChallengeController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([FarmUser, Attendance, AttendanceQrChallenge], [FarmUserRepository, AttendanceRepository, AttendanceQrChallengeRepository])],
  controllers: [AttendanceController, AttendanceQrChallengeController],
  providers: [AttendanceService, AttendanceQrChallengeService],
})
export class AttendanceModule implements OnModuleInit {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly redisSubscriber: RedisSubscriber,
  ) {}

  async onModuleInit() {
    await this.redisSubscriber.subscribePatternJSON('attendance.*', (payload, channel) => {
      this.eventEmitter.emit(channel, payload);
    });
  }
}
