import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'REFRESH_TOKENS_PK' })
  readonly id: string;

  @Column({ type: 'timestamptz', default: () => "NOW() + INTERVAL '20 DAYS'" })
  readonly expiredAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'REFRESH_TOKENS_USER_FK' })
  user: User;

  public static of(userId: string) {
    const e = new RefreshToken();

    e.user = { id: userId } as User;

    return e;
  }
}
