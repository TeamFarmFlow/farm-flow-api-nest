import { Body, Controller, Param, Post, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { filter, fromEvent, map, Observable } from 'rxjs';

import { ContextService } from '@app/core/context';
import { RequiredPermissions } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';

import { AttendanceQrChallengeService, AttendanceQrCodeGeneratedEvent } from '../application';

import { CreateAttendanceQrCodeRequest } from './dto/request';
import { CreateAttendanceQrCodeResponse } from './dto/response';

@RequiredPermissions([PermissionKey.AttendanceQrCreate])
@ApiTags('출퇴근 QR 코드')
@Controller('attendances/qr')
export class AttendanceQrChallengeController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly contextService: ContextService,
    private readonly attendanceQrChallengeService: AttendanceQrChallengeService,
  ) {}

  @Sse(':deviceId')
  @ApiOperation({ summary: '출퇴근 QR 코드 수신 SSE' })
  @ApiOkResponse({ type: CreateAttendanceQrCodeResponse })
  getAttendanceQrCodeByDevice(@Param('deviceId') deviceId: string): Observable<{ data: CreateAttendanceQrCodeResponse }> {
    return fromEvent(this.eventEmitter, 'attendance.qr.generated').pipe(
      filter((data: AttendanceQrCodeGeneratedEvent) => data.deviceId === deviceId),
      map((data: AttendanceQrCodeGeneratedEvent) => ({ data: toInstance(CreateAttendanceQrCodeResponse, data) })),
    );
  }

  @Post()
  @ApiOperation({ summary: '출퇴근 QR 코드 생성' })
  @ApiCreatedResponse({ type: CreateAttendanceQrCodeResponse })
  async createAttendanceQrCode(@Body() body: CreateAttendanceQrCodeRequest): Promise<CreateAttendanceQrCodeResponse> {
    return toInstance(CreateAttendanceQrCodeResponse, await this.attendanceQrChallengeService.createQrCode(body.toCommand(this.contextService.farmId)));
  }
}
