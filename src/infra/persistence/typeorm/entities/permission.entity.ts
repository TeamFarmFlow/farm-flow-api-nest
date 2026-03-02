import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'permissions' })
@Index('PERMISSION_KEY_IDX', ['key'])
export class Permission {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PERMISSIONS_PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 100 })
  key: string;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;
}
