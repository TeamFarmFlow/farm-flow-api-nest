import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserStatus, UserType } from './enums';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'USERS_PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 20 })
  type: UserType;

  @Column({ type: 'varchar', length: 340 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  status: UserStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;

  public static ownerOf(entityLike: Pick<User, 'email' | 'password' | 'name'>) {
    const user = new User();

    user.type = UserType.Owner;
    user.email = entityLike.email;
    user.password = entityLike.password;
    user.name = entityLike.name;
    user.status = UserStatus.Activated;

    return user;
  }
}
