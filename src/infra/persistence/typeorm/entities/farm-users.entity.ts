import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Farm } from './farm.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({ name: 'farm_users' })
@Index('FARM_USERS_ROLE_ID_IDX', ['role'], { where: 'roleId IS NOT NULL' })
export class FarmUsers {
  @PrimaryColumn('uuid', { primaryKeyConstraintName: 'FARM_USERS_PK' })
  readonly farmId: string;

  @PrimaryColumn('uuid', { primaryKeyConstraintName: 'FARM_USERS_PK' })
  readonly userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @ManyToOne(() => Farm, (e) => e.farmUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_FARM_FK' })
  farm: Farm;

  @ManyToOne(() => User, (e) => e.farmUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_USER_FK' })
  user: User;

  @ManyToOne(() => Role, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'FARM_USERS_ROLE_FK' })
  role: Role | null;
}
