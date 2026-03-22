import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RedisSubscriber } from '@app/infra/redis';

import {
  ATTENDANCE_FARM_USER_REPOSITORY,
  ATTENDANCE_QR_CODE_STORE,
  ATTENDANCE_REPOSITORY,
  CheckInAttendanceCommandHandler,
  CheckOutAttendanceCommandHandler,
  CreateAttendanceQrCodeCommandHandler,
  GetAttendanceByTodayQueryHandler,
  GetAttendancesQueryHandler,
} from './application';
import { AttendanceQrCodeStore, TypeOrmAttendanceFarmUserRepository, TypeOrmAttendanceRepository } from './infra';
import { AttendanceController, AttendanceQrCodeController } from './presentation';

@Module({
  controllers: [AttendanceController, AttendanceQrCodeController],
  providers: [
    {
      provide: ATTENDANCE_FARM_USER_REPOSITORY,
      useExisting: TypeOrmAttendanceFarmUserRepository,
    },
    {
      provide: ATTENDANCE_REPOSITORY,
      useExisting: TypeOrmAttendanceRepository,
    },
    {
      provide: ATTENDANCE_QR_CODE_STORE,
      useExisting: AttendanceQrCodeStore,
    },
    GetAttendancesQueryHandler,
    GetAttendanceByTodayQueryHandler,
    CheckInAttendanceCommandHandler,
    CheckOutAttendanceCommandHandler,
    CreateAttendanceQrCodeCommandHandler,
    TypeOrmAttendanceFarmUserRepository,
    TypeOrmAttendanceRepository,
    AttendanceQrCodeStore,
  ],
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
