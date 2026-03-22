import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserStatus } from '@app/shared/domain';

import { FarmUserEntity } from './farm-user.entity';
import { UserUsageEntity } from './user-usage.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'USERS_PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 340 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: UserStatus.Activated })
  status: UserStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  @OneToOne(() => UserUsageEntity, (e) => e.user, { cascade: ['insert', 'remove'] })
  usage: UserUsageEntity;

  @OneToMany(() => FarmUserEntity, (e) => e.user, { cascade: ['insert', 'remove'] })
  farmUsers: FarmUserEntity[];
}
