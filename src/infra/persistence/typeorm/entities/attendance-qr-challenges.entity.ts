import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Farm } from './farm.entity';

@Entity({ name: 'attendance_qr_challenges' })
export class AttendanceQrChallenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  farmId: string;

  @Column({ type: 'timestamptz', default: () => "NOW() + INTERVAL '1 MINUTE'" })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  consumedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @ManyToOne(() => Farm, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ATTENDANCE_QR_CHANLLENGES_FARM_FK' })
  farm: Farm;

  public static of(farmId: string) {
    const attendanceQrChallenge = new AttendanceQrChallenge();

    attendanceQrChallenge.farmId = farmId;

    return attendanceQrChallenge;
  }
}
