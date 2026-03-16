import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ContextService } from '@app/core/context';
import { toInstance } from '@app/core/transform';

import { AttendanceService } from '../application';

import { CheckInAttendanceRequest, CheckOutAttendanceRequest, GetAttendanceStatisticsRequest, GetMyAttendancesRequest } from './dto/request';
import { AttendanceResponse, AttendanceStatisticsResponse, MyAttendancesResponse } from './dto/response';

@ApiTags('출퇴근')
@Controller('attendances')
export class AttendanceController {
  constructor(
    private readonly contextService: ContextService,
    private readonly attendanceService: AttendanceService,
  ) {}

  @Get()
  @ApiOperation({ summary: '나의 출퇴근 기록 조회' })
  @ApiOkResponse({ type: MyAttendancesResponse })
  async getMyAttendances(@Query() query: GetMyAttendancesRequest): Promise<MyAttendancesResponse> {
    return toInstance(MyAttendancesResponse, await this.attendanceService.getMyAttendances(query.toQuery(this.contextService.farmId, this.contextService.userId)));
  }

  @Get('today')
  @ApiOperation({ summary: '오늘 출퇴근 기록 조회' })
  @ApiOkResponse({ type: AttendanceResponse })
  async getAttendanceByToday() {
    return toInstance(AttendanceResponse, await this.attendanceService.getAttendanceByToday(this.contextService.farmId, this.contextService.userId));
  }

  @Get('statistics')
  @ApiOperation({ summary: '출퇴근 통계 조회' })
  @ApiOkResponse({ type: [AttendanceStatisticsResponse] })
  async getAttendanceStatistics(@Query() query: GetAttendanceStatisticsRequest): Promise<AttendanceStatisticsResponse> {
    return toInstance(AttendanceStatisticsResponse, await this.attendanceService.getAttendanceStatistics(query.toQuery(this.contextService.farmId)));
  }

  @Post('checkin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '출근' })
  @ApiOkResponse({ type: AttendanceResponse })
  async checkInAttendance(@Body() body: CheckInAttendanceRequest) {
    return toInstance(AttendanceResponse, await this.attendanceService.checkInAttendnace(body.toCommand(this.contextService.farmId, this.contextService.userId)));
  }

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '퇴근' })
  @ApiOkResponse({ type: AttendanceResponse })
  async checkOutAttendance(@Body() body: CheckOutAttendanceRequest) {
    return toInstance(AttendanceResponse, await this.attendanceService.checkOutAttendnace(body.toCommand(this.contextService.farmId, this.contextService.userId)));
  }
}
