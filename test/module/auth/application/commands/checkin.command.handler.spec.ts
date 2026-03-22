import { describe, expect, it, vi } from 'vitest';

import { CheckInCommandHandler } from '@app/module/auth/application';
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
  refreshToken.farmId = null;

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

describe('CheckInCommandHandler', () => {
  it('리프레시 토큰을 확인하고 농장 체크인 세션으로 교체한다', async () => {
    const authResult = createAuthResult();
    const refreshToken = createRefreshToken();
    const authSessionService = createAuthSessionService();
    const getAuthContextQueryHandler = {
      execute: vi.fn().mockResolvedValue(authResult),
    };

    authSessionService.getRefreshTokenOrThrow = vi.fn().mockResolvedValue(refreshToken);
    authSessionService.rotateRefreshToken = vi.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const handler = new CheckInCommandHandler(authSessionService, getAuthContextQueryHandler);

    await expect(
      handler.execute({
        farmId: 'farm-1',
        refreshTokenId: 'refresh-token-1',
        userId: 'user-1',
      }),
    ).resolves.toEqual({
      ...authResult,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(getAuthContextQueryHandler.execute).toHaveBeenCalledWith({
      userId: 'user-1',
      farmId: 'farm-1',
    });
    expect(authSessionService.rotateRefreshToken).toHaveBeenCalledWith('refresh-token-1', 'user-1', 'farm-1');
  });
});
