import { Inject, Injectable } from '@nestjs/common';

import { ATTENDANCE_FARM_USER_REPOSITORY, ATTENDANCE_REPOSITORY, AttendanceFarmUserRepositoryPort, AttendanceRepositoryPort } from '../ports';

import { GetAttendanceByTodayQuery } from './get-attendance-by-today.query';

@Injectable()
export class GetAttendanceByTodayQueryHandler {
  constructor(
    @Inject(ATTENDANCE_FARM_USER_REPOSITORY)
    private readonly farmUserRepository: AttendanceFarmUserRepositoryPort,
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: AttendanceRepositoryPort,
  ) {}

  async execute(query: GetAttendanceByTodayQuery) {
    const workDate = await this.farmUserRepository.getCurrentWorkDateOrFail(query.farmId, query.userId);

    return this.attendanceRepository.findByWorkDate(query.farmId, query.userId, workDate);
  }
}
