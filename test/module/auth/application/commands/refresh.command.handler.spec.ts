import { describe, expect, it, vi } from 'vitest';

import { RefreshCommandHandler } from '@app/module/auth/application';
import { AuthSessionService } from '@app/module/auth/application/services';
import { AuthFarm, AuthRole, AuthUser, RefreshToken } from '@app/module/auth/domain';
import { PermissionKey, UserStatus } from '@app/shared/domain';

function createAuthResult() {
  const user = new AuthUser();
  const farm = new AuthFarm();
  const role = new AuthRole();

  user.id = 'user-1';
  user.email = 'farmer@example.com';
  user.passwordHash = 'hashed-password';
  user.name = 'Farmer Kim';
  user.status = UserStatus.Activated;

  farm.id = 'farm-1';
  farm.name = 'Morning Farm';

  role.id = 'role-1';
  role.name = 'Manager';
  role.required = true;
  role.super = false;
  role.permissionKeys = [PermissionKey.MemberRead];

  return { user, farm, role };
}

function createRefreshToken() {
  const refreshToken = RefreshToken.from('refresh-token-1');

  refreshToken.userId = 'user-1';
  refreshToken.farmId = 'farm-1';

  return refreshToken;
}

function createAuthSessionService() {
  return {
    getRefreshTokenOrThrow: vi.fn(),
    issueAuthTokens: vi.fn(),
    rotateRefreshToken: vi.fn(),
    revokeRefreshToken: vi.fn(),
  } as unknown as AuthSessionService;
}

describe('RefreshCommandHandler', () => {
  it('리프레시 토큰으로 인증 컨텍스트를 조회하고 세션을 회전한다', async () => {
    const refreshToken = createRefreshToken();
    const authResult = createAuthResult();
    const authSessionService = createAuthSessionService();
    const getAuthContextQueryHandler = {
      execute: vi.fn().mockResolvedValue(authResult),
    };

    authSessionService.getRefreshTokenOrThrow = vi.fn().mockResolvedValue(refreshToken);
    authSessionService.rotateRefreshToken = vi.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const handler = new RefreshCommandHandler(authSessionService, getAuthContextQueryHandler);

    await expect(handler.execute({ refreshTokenId: refreshToken.id })).resolves.toEqual({
      ...authResult,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(getAuthContextQueryHandler.execute).toHaveBeenCalledWith({
      userId: refreshToken.userId,
      farmId: refreshToken.farmId,
    });
    expect(authSessionService.rotateRefreshToken).toHaveBeenCalledWith(refreshToken.id, refreshToken.userId, refreshToken.farmId);
  });
});
