import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { RequiredPermissions } from '@app/core/security';
import { toInstance } from '@app/core/transform';
import { PermissionKey } from '@app/shared/domain';
import { AuthFarmPrincipal } from '@app/shared/security';

import { AttendanceQrChallengeService } from '../application';

import { CreateAttendanceQrCodeResponse } from './dto/response';

@RequiredPermissions([PermissionKey.AttendanceQrCreate])
@ApiTags('출퇴근 QR 코드')
@Controller('attendances/qr')
export class AttendanceQrChallengeController {
  constructor(
    private readonly contextService: ContextService<AuthFarmPrincipal>,
    private readonly attendanceQrChallengeService: AttendanceQrChallengeService,
  ) {}

  @Post()
  @ApiOperation({ summary: '출퇴근 QR 코드 생성' })
  @ApiCreatedResponse({ type: CreateAttendanceQrCodeResponse })
  async createAttendanceQrCode(): Promise<CreateAttendanceQrCodeResponse> {
    return toInstance(CreateAttendanceQrCodeResponse, await this.attendanceQrChallengeService.createQrCode(this.contextService.user.farmId));
  }
}
