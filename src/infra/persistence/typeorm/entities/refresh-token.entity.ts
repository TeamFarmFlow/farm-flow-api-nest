import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Farm } from './farm.entity';
import { User } from './user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'REFRESH_TOKENS_PK' })
  readonly id: string;

  @Column({ type: 'timestamptz', default: () => "NOW() + INTERVAL '20 DAYS'" })
  readonly expiredAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  farmId: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'REFRESH_TOKENS_USER_FK' })
  user: User;

  @ManyToOne(() => Farm, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'REFRESH_TOKENS_FARM_FK' })
  farm: Farm | null;

  public static of(userId: string, farmId: string | null) {
    const e = new RefreshToken();

    e.user = { id: userId } as User;
    e.farm = farmId ? ({ id: farmId } as Farm) : null;

    return e;
  }
}
