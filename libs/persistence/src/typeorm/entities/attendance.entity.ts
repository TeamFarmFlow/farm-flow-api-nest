import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AttendanceStatus } from '@libs/shared';

import { FarmEntity } from './farm.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'attendances' })
@Index('ATTENDANCES_UQ', ['farmId', 'userId', 'workDate'], { unique: true, where: 'deleted_at IS NULL' })
export class AttendanceEntity {
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

  @Column({ type: 'boolean', default: false })
  payrolled: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  readonly deletedAt: Date | null;

  @ManyToOne(() => FarmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ATTENDANCES_FARM_FK' })
  farm: FarmEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ATTENDANCES_USER_FK' })
  user: UserEntity;

  public static of(farm: FarmEntity, userId: string) {
    const attendance = new AttendanceEntity();

    attendance.workDate = farm.dateOfTimeZone;
    attendance.farmId = farm.id;
    attendance.userId = userId;
    attendance.status = AttendanceStatus.CheckIn;

    return attendance;
  }
}
