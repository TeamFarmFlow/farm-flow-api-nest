import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { FarmEntity } from './farm.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'farm_users' })
@Index('FARM_USERS_ROLE_ID_IDX', ['roleId'], { where: 'role_id IS NOT NULL' })
export class FarmUserEntity {
  @PrimaryColumn('uuid', { primaryKeyConstraintName: 'FARM_USERS_PK' })
  farmId: string;

  @PrimaryColumn('uuid', { primaryKeyConstraintName: 'FARM_USERS_PK' })
  userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  roleId: string | null;

  @Column({ type: 'int', default: 0 })
  payRatePerHour: number;

  @Column({ type: 'int', default: 0 })
  payDeductionAmount: number;

  @ManyToOne(() => FarmEntity, (e) => e.farmUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_FARM_FK' })
  farm: FarmEntity;

  @ManyToOne(() => UserEntity, (e) => e.farmUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_USER_FK' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (e) => e.farmUsers, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_ROLE_FK' })
  role: RoleEntity | null;

  public static of(farm: FarmEntity, userId: string, roleId: string | null = null) {
    const farmUser = new FarmUserEntity();

    farmUser.farmId = farm.id;
    farmUser.payRatePerHour = farm.payRatePerHour;
    farmUser.payDeductionAmount = farm.payDeductionAmount;
    farmUser.userId = userId;
    farmUser.roleId = roleId;

    return farmUser;
  }
}
