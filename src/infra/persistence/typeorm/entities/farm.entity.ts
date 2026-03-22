import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { dayjs } from '@app/core/time';

import { FarmUserEntity } from './farm-user.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'farms' })
export class FarmEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'FARMS_PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: 'Asia/Seoul' })
  timezone: string;

  @Column({ type: 'int', default: 0 })
  payRatePerHour: number;

  @Column({ type: 'int', default: 0 })
  payDeductionAmount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @OneToMany(() => RoleEntity, (e) => e.farm, { cascade: ['insert', 'remove'] })
  roles: RoleEntity[];

  @OneToMany(() => FarmUserEntity, (e) => e.farm, { cascade: ['insert', 'remove'] })
  farmUsers: FarmUserEntity[];

  @OneToMany(() => FarmUserEntity, (e) => e.farm, { cascade: ['insert', 'remove'] })
  farmUser: FarmUserEntity | null;

  get dateOfTimeZone() {
    return dayjs(new Date()).tz(this.timezone).format('YYYY-MM-DD');
  }
}
