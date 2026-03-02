import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { FarmUsers } from './farm-users.entity';
import { Role } from './role.entity';

@Entity({ name: 'farms' })
export class Farm {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'FARMS_PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @OneToMany(() => Role, (e) => e.farm, { cascade: ['insert', 'remove'] })
  roles: Role[];

  @OneToMany(() => FarmUsers, (e) => e.farm, { cascade: ['insert', 'remove'] })
  farmUsers: FarmUsers[];
}
