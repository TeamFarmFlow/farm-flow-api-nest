import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';

import { AttendanceService } from '../application';

@ApiTags('출퇴근')
@Controller('attendances')
export class AttendanceController {
  constructor(
    private readonly contextService: ContextService,
    private readonly attendanceService: AttendanceService,
  ) {}

  @Post('checkin')
  @ApiOperation({ summary: '출근' })
  checkInAttendance() {}

  @Post('checkout')
  @ApiOperation({ summary: '퇴근' })
  checkOutAttendance() {}
}
