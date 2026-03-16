import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { Farm } from './farm.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({ name: 'farm_users' })
@Index('FARM_USERS_ROLE_ID_IDX', ['roleId'], { where: 'role_id IS NOT NULL' })
export class FarmUser {
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

  @ManyToOne(() => Farm, (e) => e.farmUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_FARM_FK' })
  farm: Farm;

  @ManyToOne(() => User, (e) => e.farmUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_USER_FK' })
  user: User;

  @ManyToOne(() => Role, (e) => e.farmUsers, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_ROLE_FK' })
  role: Role | null;

  public static of(farmId: string, userId: string, roleId: string | null = null) {
    const farmUser = new FarmUser();

    farmUser.farmId = farmId;
    farmUser.userId = userId;
    farmUser.roleId = roleId;

    return farmUser;
  }
}
