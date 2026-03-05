import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { dayjs } from '@app/core/time';

import { FarmUser } from './farm-user.entity';
import { Role } from './role.entity';

@Entity({ name: 'farms' })
export class Farm {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'FARMS_PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: 'Asia/Seoul' })
  timezone: string;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @OneToMany(() => Role, (e) => e.farm, { cascade: ['insert', 'remove'] })
  roles: Role[];

  @OneToMany(() => FarmUser, (e) => e.farm, { cascade: ['insert', 'remove'] })
  farmUsers: FarmUser[];

  @OneToMany(() => FarmUser, (e) => e.farm, { cascade: ['insert', 'remove'] })
  farmUser: FarmUser | null;

  get dateOfTimeZone() {
    return dayjs(new Date()).tz(this.timezone).format('YYYY-MM-DD');
  }
}
