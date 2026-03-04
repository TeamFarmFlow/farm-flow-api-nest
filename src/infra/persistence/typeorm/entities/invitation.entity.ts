import { randomInt } from 'crypto';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { InvitationStatus } from '@app/shared/domain';

import { Farm } from './farm.entity';
import { User } from './user.entity';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const TOKEN_LENGTH = 6;

@Entity({ name: 'invitations' })
@Index('INVITATIONS_CODE_UQ', ['email', 'code'], { unique: true })
@Index('INVITATIONS_CODE_STATUS_EXPIRES_AT_IDX', ['code', 'status', 'expiredAt'])
@Index('INVITATIONS_CODE_EXPIRES_IDX', ['expiredAt'])
export class Invitation {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'INVITATIONS_PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 340 })
  email: string;

  @Column({ type: 'char', length: 6 })
  code: string;

  @Column({ type: 'varchar', length: 1024 })
  url: string;

  @Column({ type: 'timestamptz', default: () => "NOW() + INTERVAL '10 MINUTE'" })
  expiredAt: Date;

  @Column({ type: 'varchar', length: 20, default: InvitationStatus.Pending })
  status: InvitationStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @Column({ type: 'uuid' })
  farmId: string;

  @Column({ type: 'uuid' })
  inviterId: string;

  @ManyToOne(() => Farm, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'INVITATIONS_FARM_FK' })
  farm: Farm;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'INVITATIONS_USER_FK' })
  inviter: User;

  public static of(farmId: string, inviterId: string, email: string, url: string) {
    let code = '';

    for (let i = 0; i < TOKEN_LENGTH; i++) {
      const index = randomInt(0, CHARS.length);
      code += CHARS[index];
    }

    const invitation = new Invitation();

    invitation.farmId = farmId;
    invitation.inviterId = inviterId;
    invitation.email = email;
    invitation.url = url;
    invitation.code = code;

    return invitation;
  }
}
