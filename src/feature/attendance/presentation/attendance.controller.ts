import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { toInstance } from '@app/core/transform';

import { AttendanceService } from '../application';

import { CheckInAttendanceRequest, CheckOutAttendanceRequest } from './dto/request';
import { AttendanceResponse } from './dto/response';

@ApiTags('출퇴근')
@Controller('attendances')
export class AttendanceController {
  constructor(
    private readonly contextService: ContextService,
    private readonly attendanceService: AttendanceService,
  ) {}

  @Get('today')
  @ApiOperation({ summary: '오늘 출퇴근 기록 조회' })
  @ApiOkResponse({ type: AttendanceResponse })
  async getAttendanceByToday() {
    return toInstance(AttendanceResponse, await this.attendanceService.getAttendanceByToday(this.contextService.farmId, this.contextService.userId));
  }

  @Post('checkin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '출근' })
  @ApiNoContentResponse()
  checkInAttendance(@Body() body: CheckInAttendanceRequest) {
    return this.attendanceService.checkInAttendnace(body.toCommand(this.contextService.farmId, this.contextService.userId));
  }

  @Post('checkout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '퇴근' })
  @ApiNoContentResponse()
  checkOutAttendance(@Body() body: CheckOutAttendanceRequest) {
    return this.attendanceService.checkOutAttendnace(body.toCommand(this.contextService.farmId, this.contextService.userId));
  }
}
