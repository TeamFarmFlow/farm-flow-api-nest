import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { FarmEntity } from './farm.entity';
import { FarmUserEntity } from './farm-user.entity';
import { RolePermissionEntity } from './role-permission.entity';

@Entity({ name: 'roles' })
@Index('ROLES_FARM_ID_NAME_UK', ['farm', 'name'], { unique: true })
@Index('ROLES_FARM_ID_IDX', ['farm'])
export class RoleEntity {
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

  @ManyToOne(() => FarmEntity, (e) => e.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ROLES_FARM_FK' })
  farm: FarmEntity;

  @OneToMany(() => FarmUserEntity, (e) => e.role, { cascade: ['remove'] })
  farmUsers: FarmUserEntity[];

  @OneToMany(() => RolePermissionEntity, (e) => e.role, { cascade: true })
  permissions: RolePermissionEntity[];

  get permissionKeys() {
    return (this.permissions ?? []).map(({ key }) => key);
  }
}
