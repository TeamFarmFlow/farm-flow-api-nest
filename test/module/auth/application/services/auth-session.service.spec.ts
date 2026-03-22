import { describe, expect, it, vi } from 'vitest';

import { AuthSessionService } from '@app/module/auth/application';
import { AuthAccessTokenIssuerPort, AuthRefreshTokenStorePort } from '@app/module/auth/application/ports';
import { InvalidTokenException, RefreshToken } from '@app/module/auth/domain';

function createRefreshToken() {
  const refreshToken = RefreshToken.from('refresh-token-1');

  refreshToken.userId = 'user-1';
  refreshToken.farmId = 'farm-1';

  return refreshToken;
}

function createRefreshTokenStore() {
  return {
    get: vi.fn(),
    issue: vi.fn(),
    revoke: vi.fn(),
  } satisfies AuthRefreshTokenStorePort;
}

function createAccessTokenIssuer() {
  return {
    issue: vi.fn(),
  } satisfies AuthAccessTokenIssuerPort;
}

describe('AuthSessionService', () => {
  it('저장된 리프레시 토큰이 있으면 그대로 반환한다', async () => {
    const refreshTokenStore = createRefreshTokenStore();
    const accessTokenIssuer = createAccessTokenIssuer();
    const service = new AuthSessionService(refreshTokenStore, accessTokenIssuer);
    const refreshToken = createRefreshToken();

    refreshTokenStore.get.mockResolvedValue(refreshToken);

    await expect(service.getRefreshTokenOrThrow(refreshToken.id)).resolves.toBe(refreshToken);
    expect(refreshTokenStore.get).toHaveBeenCalledWith(refreshToken.id);
  });

  it('리프레시 토큰이 없으면 InvalidTokenException을 던진다', async () => {
    const refreshTokenStore = createRefreshTokenStore();
    const accessTokenIssuer = createAccessTokenIssuer();
    const service = new AuthSessionService(refreshTokenStore, accessTokenIssuer);

    refreshTokenStore.get.mockResolvedValue(null);

    await expect(service.getRefreshTokenOrThrow('missing-token')).rejects.toBeInstanceOf(InvalidTokenException);
  });

  it('액세스 토큰과 리프레시 토큰을 함께 발급한다', async () => {
    const refreshTokenStore = createRefreshTokenStore();
    const accessTokenIssuer = createAccessTokenIssuer();
    const service = new AuthSessionService(refreshTokenStore, accessTokenIssuer);

    accessTokenIssuer.issue.mockResolvedValue('access-token');
    refreshTokenStore.issue.mockResolvedValue('refresh-token');

    await expect(service.issueAuthTokens('user-1', 'farm-1')).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(accessTokenIssuer.issue).toHaveBeenCalledWith('user-1', 'farm-1');
    expect(refreshTokenStore.issue).toHaveBeenCalledWith('user-1', 'farm-1');
  });

  it('세션을 회전할 때 기존 리프레시 토큰을 먼저 폐기한다', async () => {
    const refreshTokenStore = createRefreshTokenStore();
    const accessTokenIssuer = createAccessTokenIssuer();
    const service = new AuthSessionService(refreshTokenStore, accessTokenIssuer);

    accessTokenIssuer.issue.mockResolvedValue('rotated-access-token');
    refreshTokenStore.issue.mockResolvedValue('rotated-refresh-token');

    await expect(service.rotateRefreshToken('refresh-token-1', 'user-1', 'farm-1')).resolves.toEqual({
      accessToken: 'rotated-access-token',
      refreshToken: 'rotated-refresh-token',
    });
    expect(refreshTokenStore.revoke).toHaveBeenCalledWith('refresh-token-1');
    expect(refreshTokenStore.revoke.mock.invocationCallOrder[0]).toBeLessThan(accessTokenIssuer.issue.mock.invocationCallOrder[0]);
  });

  it('리프레시 토큰 폐기를 저장소에 위임한다', async () => {
    const refreshTokenStore = createRefreshTokenStore();
    const accessTokenIssuer = createAccessTokenIssuer();
    const service = new AuthSessionService(refreshTokenStore, accessTokenIssuer);

    await service.revokeRefreshToken('refresh-token-1');

    expect(refreshTokenStore.revoke).toHaveBeenCalledWith('refresh-token-1');
  });
});
