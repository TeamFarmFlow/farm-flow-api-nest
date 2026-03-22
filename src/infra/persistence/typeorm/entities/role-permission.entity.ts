import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionKey } from '@app/shared/domain';

import { RoleEntity } from './role.entity';

@Entity({ name: 'role_permissions' })
@Index('ROLE_PERMISSIONS_UK', ['roleId', 'key'], { unique: true })
export class RolePermissionEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'ROLE_PERMISSIONS_PK' })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  key: PermissionKey;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @Column('uuid')
  roleId: string;

  @ManyToOne(() => RoleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ROLE_PERMISSIONS_ROLE_FK' })
  role: RoleEntity;

  public static of(roleId: string, key: PermissionKey) {
    const rolePermission = new RolePermissionEntity();

    rolePermission.roleId = roleId;
    rolePermission.key = key;

    return rolePermission;
  }
}
