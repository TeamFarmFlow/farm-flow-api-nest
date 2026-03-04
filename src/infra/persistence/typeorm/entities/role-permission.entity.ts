import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionKey } from '@app/shared/domain';

import { Role } from './role.entity';

@Entity({ name: 'role_permissions' })
@Index('ROLE_PERMISSIONS_UK', ['roleId', 'key'], { unique: true })
export class RolePermission {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'ROLE_PERMISSIONS_PK' })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  key: PermissionKey;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @Column('uuid')
  roleId: string;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ROLE_PERMISSIONS_ROLE_FK' })
  role: Role;

  public static of(roleId: string, key: PermissionKey) {
    const rolePermission = new RolePermission();

    rolePermission.roleId = roleId;
    rolePermission.key = key;

    return rolePermission;
  }
}
