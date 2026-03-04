import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { dayjs } from '@app/core/time';
import { AttendanceStatus } from '@app/shared/domain';

import { Farm } from './farm.entity';
import { User } from './user.entity';

@Entity({ name: 'attendances' })
export class Attendance {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'ATTENDANCES_PK' })
  readonly id: string;

  @Column({ type: 'date' })
  workDate: string;

  @Column({ type: 'uuid' })
  farmId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  checkedInAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  checkedOutAt: Date | null;

  @Column({ type: 'varchar', length: 10, default: AttendanceStatus.CheckIn })
  status: AttendanceStatus;

  @Column({ type: 'int', default: 0 })
  seconds: number;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @ManyToOne(() => Farm, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ATTENDANCES_FARM_FK' })
  farm: Farm;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ATTENDANCES_USER_FK' })
  user: User;

  public static of(farm: Farm, userId: string) {
    const attendance = new Attendance();

    attendance.workDate = dayjs(new Date()).tz(farm.timezone).format('YYYY-MM-DD');
    attendance.farmId = farm.id;
    attendance.userId = userId;

    return attendance;
  }
}
