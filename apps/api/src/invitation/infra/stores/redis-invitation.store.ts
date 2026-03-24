import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { RedisClient } from '@libs/redis';

import { InvitationStorePort } from '../../application';
import { Invitation } from '../../domain';

@Injectable()
export class RedisInvitationStore implements InvitationStorePort {
  constructor(private readonly redisClient: RedisClient) {}

  async issue(email: string, url: string, farmId: string): Promise<Invitation> {
    const invitation = Invitation.of(email, url, farmId);

    await this.redisClient.setJSON(invitation.key(), invitation);
    await this.redisClient.expire(invitation.key(), invitation.expiresIn());

    return invitation;
  }

  async get(code: string): Promise<Invitation | null> {
    return plainToInstance(Invitation, await this.redisClient.getJSON(Invitation.from(code).key()));
  }

  async revoke(code: string): Promise<void> {
    await this.redisClient.del(Invitation.from(code).key());
  }
}
