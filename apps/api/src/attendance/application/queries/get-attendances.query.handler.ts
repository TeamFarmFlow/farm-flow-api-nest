import { Inject, Injectable } from '@nestjs/common';

import { ATTENDANCE_REPOSITORY, AttendanceRepositoryPort } from '../ports';
import { GetAttendancesResult } from '../results';

import { GetAttendancesQuery } from './get-attendances.query';

@Injectable()
export class GetAttendancesQueryHandler {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: AttendanceRepositoryPort,
  ) {}

  async execute(query: GetAttendancesQuery): Promise<GetAttendancesResult> {
    const [rows, total] = await this.attendanceRepository.findByFarmIdAndUserIdAndDateRange(query.farmId, query.userId, query.startDate, query.endDate);

    return { total, rows };
  }
}
