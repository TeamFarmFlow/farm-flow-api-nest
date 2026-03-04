import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { PermissionKey } from '@app/shared/domain';

import { Role } from './role.entity';

@Entity({ name: 'role_permissions' })
@Index('ROLE_PERMISSIONS_UK', ['roleId', 'key'], { unique: true })
export class RolePermission {
  @PrimaryColumn('uuid', { primaryKeyConstraintName: 'ROLE_PERMISSIONS_PK' })
  roleId: string;

  @PrimaryColumn('varchar', { length: 50, primaryKeyConstraintName: 'ROLE_PERMISSIONS_PK' })
  key: PermissionKey;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

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
