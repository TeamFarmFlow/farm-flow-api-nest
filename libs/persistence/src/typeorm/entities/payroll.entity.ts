import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { FarmEntity } from './farm.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'payrolls' })
@Index('PAYROLLS_USER_ID_IDX', ['userId'], { where: 'payrolls.user_id IS NOT NULL' })
@Index('PAYROLLS_FARM_ID_IDX', ['farmId'], { where: 'payrolls.farm_id IS NOT NULL' })
@Index('PAYROLLS_FARM_USER_ID_IDX', ['farmId', 'userId'], { where: 'payrolls.farm_id IS NOT NULL AND payrolls.user_id IS NOT NULL' })
export class PayrollEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PAYROLLS_PK' })
  id: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'int', default: 0 })
  totalSeconds: number;

  @Column({ type: 'int', default: 0 })
  totalPaymentAmount: number;

  @Column({ type: 'int', default: 0 })
  totalDeductionAmount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  farmId: string | null;

  @ManyToOne(() => FarmEntity, (e) => e.farmUsers, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'PAYROLLS_FARM_FK' })
  farm: FarmEntity;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => UserEntity, (e) => e.farmUsers, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'PAYROLLS_USER_FK' })
  user: UserEntity;
}
