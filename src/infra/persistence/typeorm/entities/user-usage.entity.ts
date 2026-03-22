import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_usages' })
export class UserUsageEntity {
  @PrimaryColumn({ type: 'uuid', primaryKeyConstraintName: 'USER_USAGES_PK' })
  readonly userId: string;

  @Column({ type: 'int', default: 0 })
  farmCount: number;

  @Column({ type: 'int', default: 3 })
  farmLimit: number;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @OneToOne(() => UserEntity, (e) => e.usage, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'USER_USAGES_USER_FK' })
  user: UserEntity;
}
