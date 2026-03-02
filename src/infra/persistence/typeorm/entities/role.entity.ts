import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Farm } from './farm.entity';

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

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @ManyToOne(() => Farm, (e) => e.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'ROLES_FARM_FK' })
  farm: Farm;
}
