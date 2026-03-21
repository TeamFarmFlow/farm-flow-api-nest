import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { RedisClient } from '@app/infra/redis';

import { AuthRefreshTokenStorePort } from '../../application';
import { RefreshToken } from '../../domain';

@Injectable()
export class RedisRefreshTokenStore implements AuthRefreshTokenStorePort {
  constructor(private readonly redisClient: RedisClient) {}

  async issue(userId: string, farmId: string | null = null): Promise<string> {
    const refreshToken = RefreshToken.of(userId, farmId);

    await this.redisClient.setJSON(refreshToken.key(), refreshToken);
    await this.redisClient.expire(refreshToken.key(), refreshToken.expiresIn());

    return refreshToken.id;
  }

  async get(refreshTokenId: string): Promise<RefreshToken | null> {
    return plainToInstance(RefreshToken, await this.redisClient.getJSON(RefreshToken.from(refreshTokenId).key()));
  }

  async revoke(refreshTokenId: string): Promise<void> {
    await this.redisClient.del(RefreshToken.from(refreshTokenId).key());
  }
}
