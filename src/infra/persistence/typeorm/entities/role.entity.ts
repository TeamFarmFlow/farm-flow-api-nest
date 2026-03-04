import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Farm } from './farm.entity';
import { FarmUser } from './farm-user.entity';
import { RolePermission } from './role-permission.entity';

@Entity({ name: 'roles' })
@Index('ROLES_FARM_ID_NAME_UK', ['farm', 'name'], { unique: true })
@Index('ROLES_FARM_ID_IDX', ['farm'])
export class Role {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'ROLES_PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'boolean', default: false })
  required: boolean;

  @Column({ type: 'boolean', default: false })
  super: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @Column({ type: 'uuid' })
  farmId: string;

  @ManyToOne(() => Farm, (e) => e.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ROLES_FARM_FK' })
  farm: Farm;

  @OneToMany(() => FarmUser, (e) => e.role, { cascade: ['remove'] })
  farmUsers: FarmUser[];

  @OneToMany(() => RolePermission, (e) => e.role, { cascade: true })
  permissions: RolePermission[];

  get permissionKeys() {
    return (this.permissions ?? []).map(({ key }) => key);
  }
}
