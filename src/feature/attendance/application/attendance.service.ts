import { Injectable } from '@nestjs/common';

import { AttendanceQrChallengeRepository, AttendanceRepository, FarmUserRepository } from '@app/infra/persistence/typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly farmUserRepository: FarmUserRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly attendanceQrChallengeRepository: AttendanceQrChallengeRepository,
  ) {}
}
