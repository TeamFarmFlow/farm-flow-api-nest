import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity({ name: 'role_permissions' })
export class RolePermission {
  @PrimaryColumn('uuid', { primaryKeyConstraintName: 'ROLE_PERMISSIONS_PK' })
  readonly roleId: string;

  @PrimaryColumn('uuid', { primaryKeyConstraintName: 'ROLE_PERMISSIONS_PK' })
  readonly permissionId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ROLE_PERMISSIONS_ROLE_FK' })
  role: Role;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ROLE_PERMISSIONS_PERMISSION_FK' })
  permission: Permission;
}
