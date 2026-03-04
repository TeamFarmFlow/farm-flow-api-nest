import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TransactionalRepository, TypeOrmExRepository } from '../common';
import { Attendance } from '../entities';

@TypeOrmExRepository(Attendance)
export class AttendanceRepository extends TransactionalRepository<Attendance> {
  constructor(
    @InjectRepository(Attendance)
    repository: Repository<Attendance>,
  ) {
    super(repository);
  }
}
