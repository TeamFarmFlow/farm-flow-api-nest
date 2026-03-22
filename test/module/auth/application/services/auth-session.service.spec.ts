import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AuthAccessTokenIssuerPort, AuthRefreshTokenStorePort, AuthSessionService } from '@app/module/auth/application';
import { InvalidTokenException } from '@app/module/auth/domain';

import { authAccessTokenIssuerFixture } from '../fixtures/auth-access-token-issuer.fixture';
import { authRefreshTokenStoreFixture } from '../fixtures/auth-refresh-token-store.fixture';

describe('AuthSessionService', () => {
  let refreshTokenStore: AuthRefreshTokenStorePort;
  let accessTokenIssuer: AuthAccessTokenIssuerPort;
  let service: AuthSessionService;

  beforeAll(() => {
    refreshTokenStore = authRefreshTokenStoreFixture;
    accessTokenIssuer = authAccessTokenIssuerFixture;
    service = new AuthSessionService(refreshTokenStore, accessTokenIssuer);
  });

  it('저장된 리프레시 토큰이 있으면 그대로 반환한다', async () => {
    const refreshToken = {
      id: 'refresh-token-1',
      userId: 'user-1',
      farmId: 'farm-1',
    };

    refreshTokenStore.get = vi.fn().mockResolvedValue(refreshToken);

    await expect(service.getRefreshTokenOrThrow(refreshToken.id)).resolves.toBe(refreshToken);
    expect(refreshTokenStore.get).toHaveBeenCalledWith(refreshToken.id);
  });

  it('리프레시 토큰이 없으면 InvalidTokenException을 던진다', async () => {
    refreshTokenStore.get = vi.fn().mockResolvedValue(null);

    await expect(service.getRefreshTokenOrThrow('missing-token')).rejects.toBeInstanceOf(InvalidTokenException);
  });

  it('액세스 토큰과 리프레시 토큰을 함께 발급한다', async () => {
    accessTokenIssuer.issue = vi.fn().mockResolvedValue('access-token');
    refreshTokenStore.issue = vi.fn().mockResolvedValue('refresh-token');

    await expect(service.issueAuthTokens('user-1', 'farm-1')).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(accessTokenIssuer.issue).toHaveBeenCalledWith('user-1', 'farm-1');
    expect(refreshTokenStore.issue).toHaveBeenCalledWith('user-1', 'farm-1');
  });

  it('세션을 회전할 때 기존 리프레시 토큰을 먼저 폐기한다', async () => {
    const revokeRefreshToken = vi.fn();
    const issueAccessToken = vi.fn().mockResolvedValue('rotated-access-token');
    const issueRefreshToken = vi.fn().mockResolvedValue('rotated-refresh-token');

    refreshTokenStore.revoke = revokeRefreshToken;
    accessTokenIssuer.issue = issueAccessToken;
    refreshTokenStore.issue = issueRefreshToken;

    await expect(service.rotateRefreshToken('refresh-token-1', 'user-1', 'farm-1')).resolves.toEqual({
      accessToken: 'rotated-access-token',
      refreshToken: 'rotated-refresh-token',
    });
    expect(refreshTokenStore.revoke).toHaveBeenCalledWith('refresh-token-1');
    expect(revokeRefreshToken.mock.invocationCallOrder[0]).toBeLessThan(issueAccessToken.mock.invocationCallOrder[0]);
  });

  it('리프레시 토큰 폐기를 저장소에 위임한다', async () => {
    refreshTokenStore.revoke = vi.fn();

    await service.revokeRefreshToken('refresh-token-1');

    expect(refreshTokenStore.revoke).toHaveBeenCalledWith('refresh-token-1');
  });
});
