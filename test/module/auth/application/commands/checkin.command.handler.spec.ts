import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AuthSessionServicePort, CheckInCommandHandler, GetAuthContextQueryHandler } from '@app/module/auth/application';
import { PermissionKey, UserStatus } from '@app/shared/domain';

import { authFarmUserRepositoryFixture } from '../fixtures/auth-farm-user.repository.fixture';
import { authRolePermissionRepositoryFixture } from '../fixtures/auth-role-permission.repository.fixture';
import { authSessionServiceFixture } from '../fixtures/auth-session.service.fixture';
import { authUserRepositoryFixture } from '../fixtures/auth-user.repository.fixture';

describe('CheckInCommandHandler', () => {
  let sessionService: AuthSessionServicePort;
  let getAuthContextQueryHandler: GetAuthContextQueryHandler;
  let handler: CheckInCommandHandler;

  beforeAll(() => {
    sessionService = authSessionServiceFixture;
    getAuthContextQueryHandler = new GetAuthContextQueryHandler(authUserRepositoryFixture, authFarmUserRepositoryFixture, authRolePermissionRepositoryFixture);
    handler = new CheckInCommandHandler(sessionService, getAuthContextQueryHandler);
  });

  it('리프레시 토큰을 확인하고 농장 체크인 세션으로 교체한다', async () => {
    getAuthContextQueryHandler.execute = vi.fn().mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        name: 'User',
        status: UserStatus.Activated,
      },
      farm: {
        id: 'farm-1',
        name: 'farm',
      },
      role: {
        id: 'role-1',
        name: 'Administrator',
        required: true,
        super: true,
        permissionKeys: [PermissionKey.MemberRead],
      },
    });

    sessionService.getRefreshTokenOrThrow = vi.fn().mockResolvedValue({
      userId: 'user-1',
      farmId: null,
    });
    sessionService.rotateRefreshToken = vi.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    await expect(
      handler.execute({
        refreshTokenId: 'refresh-token-1',
        farmId: 'farm-1',
        userId: 'user-1',
      }),
    ).resolves.toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        name: 'User',
        status: UserStatus.Activated,
      },
      farm: {
        id: 'farm-1',
        name: 'farm',
      },
      role: {
        id: 'role-1',
        name: 'Administrator',
        required: true,
        super: true,
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
