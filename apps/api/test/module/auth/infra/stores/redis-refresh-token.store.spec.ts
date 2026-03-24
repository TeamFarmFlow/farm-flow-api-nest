import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RedisClient } from '@libs/redis';

import { RedisRefreshTokenStore } from '@apps/api/auth/infra';

describe('RedisRefreshTokenStore', () => {
  let redisClient: RedisClient;
  let redisRefreshTokenStore: RedisRefreshTokenStore;

  beforeEach(() => {
    redisClient = new RedisClient({ lazyConnect: true });
    redisRefreshTokenStore = new RedisRefreshTokenStore(redisClient);
  });

  it('리프레시 토큰을 발급한다.', async () => {
    redisClient.setJSON = vi.fn().mockResolvedValue(undefined);
    redisClient.expire = vi.fn().mockResolvedValue(undefined);

    const refreshTokenId = await redisRefreshTokenStore.issue('user-1', 'farm-1');

    expect(redisClient.setJSON).toHaveBeenCalledTimes(1);
    expect(redisClient.expire).toHaveBeenCalledTimes(1);
    expect(refreshTokenId).toEqual(expect.any(String));
  });

  it('리프레시 토큰을 폐기한다.', async () => {
    redisClient.del = vi.fn().mockResolvedValue(undefined);

    await redisRefreshTokenStore.revoke('refresh-token-id');

    expect(redisClient.del).toHaveBeenCalledTimes(1);
    expect(redisClient.del).toHaveBeenCalledWith('jwt:refresh-token-id');
  });
});
