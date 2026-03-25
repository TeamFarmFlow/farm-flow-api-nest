import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CONTEXT_SERVICE, ContextServicePort } from '@apps/api/context';

import { CheckInAttendanceCommandHandler, CheckOutAttendanceCommandHandler, GetAttendanceByTodayQueryHandler, GetAttendancesQueryHandler } from '../application';

import { CheckInAttendanceRequest, CheckOutAttendanceRequest, GetAttendancesRequest } from './dto/request';
import { AttendanceResponse, AttendancesResponse } from './dto/response';

@ApiTags('출퇴근')
@Controller('attendances')
export class AttendanceController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextServicePort,
    private readonly getAttendancesQueryHandler: GetAttendancesQueryHandler,
    private readonly getAttendanceByTodayQueryHandler: GetAttendanceByTodayQueryHandler,
    private readonly checkInAttendanceCommandHandler: CheckInAttendanceCommandHandler,
    private readonly checkOutAttendanceCommandHandler: CheckOutAttendanceCommandHandler,
  ) {}

  @Get()
  @ApiOperation({ summary: '출퇴근 기록 조회' })
  @ApiOkResponse({ type: AttendancesResponse })
  async getAttendances(@Query() query: GetAttendancesRequest): Promise<AttendancesResponse> {
    return AttendancesResponse.fromResult(await this.getAttendancesQueryHandler.execute(query.toQuery(this.contextService.user)));
  }

  @Get('today')
  @ApiOperation({ summary: '오늘 출퇴근 기록 조회' })
  @ApiOkResponse({ type: AttendanceResponse })
  async getAttendanceByToday() {
    const attendance = await this.getAttendanceByTodayQueryHandler.execute(this.contextService.user);

    return attendance ? AttendanceResponse.fromAttendance(attendance) : null;
  }

  @Post('checkin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '출근' })
  @ApiOkResponse({ type: AttendanceResponse })
  async checkInAttendance(@Body() body: CheckInAttendanceRequest) {
    return AttendanceResponse.fromAttendance(await this.checkInAttendanceCommandHandler.execute(body.toCommand(this.contextService.user)));
  }

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '퇴근' })
  @ApiOkResponse({ type: AttendanceResponse })
  async checkOutAttendance(@Body() body: CheckOutAttendanceRequest) {
    return AttendanceResponse.fromAttendance(await this.checkOutAttendanceCommandHandler.execute(body.toCommand(this.contextService.user)));
  }
}
