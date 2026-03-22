import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AuthSessionServicePort, GetAuthContextQueryHandler, RefreshCommandHandler } from '@app/module/auth/application';
import { PermissionKey, UserStatus } from '@app/shared/domain';

import { authFarmUserRepositoryFixture } from '../fixtures/auth-farm-user.repository.fixture';
import { authRolePermissionRepositoryFixture } from '../fixtures/auth-role-permission.repository.fixture';
import { authSessionServiceFixture } from '../fixtures/auth-session.service.fixture';
import { authUserRepositoryFixture } from '../fixtures/auth-user.repository.fixture';

describe('RefreshCommandHandler', () => {
  let sessionService: AuthSessionServicePort;
  let getAuthContextQueryHandler: GetAuthContextQueryHandler;
  let handler: RefreshCommandHandler;

  beforeAll(() => {
    sessionService = authSessionServiceFixture;
    getAuthContextQueryHandler = new GetAuthContextQueryHandler(authUserRepositoryFixture, authFarmUserRepositoryFixture, authRolePermissionRepositoryFixture);
    handler = new RefreshCommandHandler(sessionService, getAuthContextQueryHandler);
  });

  it('리프레시 토큰으로 인증 컨텍스트를 조회하고 세션을 회전한다', async () => {
    getAuthContextQueryHandler.execute = vi.fn().mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'farmer@example.com',
        passwordHash: 'hashed-password',
        name: 'Farmer Kim',
        status: UserStatus.Activated,
      },
      farm: {
        id: 'farm-1',
        name: 'Morning Farm',
      },
      role: {
        id: 'role-1',
        name: 'Manager',
        required: true,
        super: false,
        permissionKeys: [PermissionKey.MemberRead],
      },
    });

    sessionService.getRefreshTokenOrThrow = vi.fn().mockResolvedValue({
      id: 'refresh-token-1',
      userId: 'user-1',
      farmId: 'farm-1',
    });
    sessionService.rotateRefreshToken = vi.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    await expect(handler.execute({ refreshTokenId: 'refresh-token-1' })).resolves.toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: 'user-1',
        email: 'farmer@example.com',
        passwordHash: 'hashed-password',
        name: 'Farmer Kim',
        status: UserStatus.Activated,
      },
      farm: {
        id: 'farm-1',
        name: 'Morning Farm',
      },
      role: {
        id: 'role-1',
        name: 'Manager',
        required: true,
        super: false,
        permissionKeys: [PermissionKey.MemberRead],
      },
    });
    expect(getAuthContextQueryHandler.execute).toHaveBeenCalledWith({
      userId: 'user-1',
      farmId: 'farm-1',
    });
    expect(sessionService.rotateRefreshToken).toHaveBeenCalledWith('refresh-token-1', 'user-1', 'farm-1');
  });
});
