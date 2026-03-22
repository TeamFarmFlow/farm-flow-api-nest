import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Attendance, AttendanceRepository, FarmUser, FarmUserRepository, TypeOrmExModule } from '@app/infra/persistence/typeorm';
import { RedisSubscriber } from '@app/infra/redis';

import { AttendanceQrCodeService, AttendanceService } from './application';
import { AttendanceController, AttendanceQrCodeController } from './presentation';

@Module({
  imports: [TypeOrmExModule.forFeature([FarmUser, Attendance], [FarmUserRepository, AttendanceRepository])],
  controllers: [AttendanceController, AttendanceQrCodeController],
  providers: [AttendanceService, AttendanceQrCodeService],
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
