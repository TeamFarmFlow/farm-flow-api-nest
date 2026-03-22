import { beforeAll, describe, expect, it, vi } from 'vitest';

import { PermissionKey, UserStatus } from '@libs/shared';

import { AuthFarmUserRepositoryPort, AuthRolePermissionRepositoryPort, AuthUserRepositoryPort, GetAuthContextQueryHandler } from '@apps/api/auth/application';

import { authFarmUserRepositoryFixture } from '../fixtures/auth-farm-user.repository.fixture';
import { authRolePermissionRepositoryFixture } from '../fixtures/auth-role-permission.repository.fixture';
import { authUserRepositoryFixture } from '../fixtures/auth-user.repository.fixture';

describe('GetAuthContextQueryHandler', () => {
  let userRepository: AuthUserRepositoryPort;
  let farmUserRepository: AuthFarmUserRepositoryPort;
  let rolePermissionRepository: AuthRolePermissionRepositoryPort;
  let handler: GetAuthContextQueryHandler;

  beforeAll(() => {
    userRepository = authUserRepositoryFixture;
    farmUserRepository = authFarmUserRepositoryFixture;
    rolePermissionRepository = authRolePermissionRepositoryFixture;

    handler = new GetAuthContextQueryHandler(userRepository, farmUserRepository, rolePermissionRepository);
  });

  it('farmId가 없으면 유저 정보만 반환한다', async () => {
    const user = {
      id: 'user-1',
      email: 'farmer@example.com',
      passwordHash: 'hashed-password',
      name: 'Farmer Kim',
      status: UserStatus.Activated,
    };

    userRepository.findOneById = vi.fn().mockResolvedValue(user);
    farmUserRepository.findOneByFarmIdAndUserId = vi.fn();
    rolePermissionRepository.findKeysByRoleId = vi.fn();

    await expect(handler.execute({ userId: user.id, farmId: null })).resolves.toEqual({
      user,
      farm: null,
      role: null,
    });
    expect(farmUserRepository.findOneByFarmIdAndUserId).not.toHaveBeenCalled();
    expect(rolePermissionRepository.findKeysByRoleId).not.toHaveBeenCalled();
  });

  it('farmId가 있으면 역할 권한까지 채운 인증 컨텍스트를 반환한다', async () => {
    const user = {
      id: 'user-1',
      email: 'farmer@example.com',
      passwordHash: 'hashed-password',
      name: 'Farmer Kim',
      status: UserStatus.Activated,
    };

    userRepository.findOneById = vi.fn().mockResolvedValue(user);
    farmUserRepository.findOneByFarmIdAndUserId = vi.fn().mockResolvedValue({
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
    rolePermissionRepository.findKeysByRoleId = vi.fn().mockResolvedValue([PermissionKey.MemberRead, PermissionKey.MemberRemove]);

    await expect(handler.execute({ userId: user.id, farmId: 'farm-1' })).resolves.toEqual({
      user,
      farm: {
        id: 'farm-1',
        name: 'Morning Farm',
      },
      role: {
        id: 'role-1',
        name: 'Manager',
        required: true,
        super: false,
        permissionKeys: [PermissionKey.MemberRead, PermissionKey.MemberRemove],
      },
    });
    expect(rolePermissionRepository.findKeysByRoleId).toHaveBeenCalledWith('role-1');
  });
});
