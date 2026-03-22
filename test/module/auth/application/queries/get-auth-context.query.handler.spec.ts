import { describe, expect, it, vi } from 'vitest';

import { GetAuthContextQueryHandler } from '@app/module/auth/application';
import { AuthFarmUserRepositoryPort, AuthRolePermissionRepositoryPort, AuthUserRepositoryPort } from '@app/module/auth/application/ports';
import { AuthFarm, AuthFarmUser, AuthRole, AuthUser } from '@app/module/auth/domain';
import { PermissionKey, UserStatus } from '@app/shared/domain';

function createUser() {
  const user = new AuthUser();

  user.id = 'user-1';
  user.email = 'farmer@example.com';
  user.passwordHash = 'hashed-password';
  user.name = 'Farmer Kim';
  user.status = UserStatus.Activated;

  return user;
}

function createFarmUser() {
  const farm = new AuthFarm();
  const role = new AuthRole();
  const farmUser = new AuthFarmUser();

  farm.id = 'farm-1';
  farm.name = 'Morning Farm';

  role.id = 'role-1';
  role.name = 'Manager';
  role.required = true;
  role.super = false;
  role.permissionKeys = [PermissionKey.MemberRead];

  farmUser.farm = farm;
  farmUser.role = role;

  return farmUser;
}

function createUserRepository(overrides: Partial<AuthUserRepositoryPort> = {}) {
  return {
    hasOneByEmail: vi.fn(),
    findOneByEmail: vi.fn(),
    findOneById: vi.fn(),
    save: vi.fn(),
    ...overrides,
  } satisfies AuthUserRepositoryPort;
}

function createFarmUserRepository(overrides: Partial<AuthFarmUserRepositoryPort> = {}) {
  return {
    findOneByFarmIdAndUserId: vi.fn(),
    ...overrides,
  } satisfies AuthFarmUserRepositoryPort;
}

function createRolePermissionRepository(overrides: Partial<AuthRolePermissionRepositoryPort> = {}) {
  return {
    findKeysByRoleId: vi.fn(),
    ...overrides,
  } satisfies AuthRolePermissionRepositoryPort;
}

describe('GetAuthContextQueryHandler', () => {
  it('farmId가 없으면 유저 정보만 반환한다', async () => {
    const user = createUser();
    const userRepository = createUserRepository({
      findOneById: vi.fn().mockResolvedValue(user),
    });
    const farmUserRepository = createFarmUserRepository();
    const rolePermissionRepository = createRolePermissionRepository();
    const handler = new GetAuthContextQueryHandler(userRepository, farmUserRepository, rolePermissionRepository);

    await expect(handler.execute({ userId: user.id, farmId: null })).resolves.toEqual({
      user,
      farm: null,
      role: null,
    });
    expect(farmUserRepository.findOneByFarmIdAndUserId).not.toHaveBeenCalled();
    expect(rolePermissionRepository.findKeysByRoleId).not.toHaveBeenCalled();
  });

  it('farmId가 있으면 역할 권한까지 채운 인증 컨텍스트를 반환한다', async () => {
    const user = createUser();
    const farmUser = createFarmUser();
    const userRepository = createUserRepository({
      findOneById: vi.fn().mockResolvedValue(user),
    });
    const farmUserRepository = createFarmUserRepository({
      findOneByFarmIdAndUserId: vi.fn().mockResolvedValue(farmUser),
    });
    const rolePermissionRepository = createRolePermissionRepository({
      findKeysByRoleId: vi.fn().mockResolvedValue([PermissionKey.MemberRead, PermissionKey.MemberRemove]),
    });
    const handler = new GetAuthContextQueryHandler(userRepository, farmUserRepository, rolePermissionRepository);

    await expect(handler.execute({ userId: user.id, farmId: farmUser.farm.id })).resolves.toEqual({
      user,
      farm: farmUser.farm,
      role: {
        ...farmUser.role!,
        permissionKeys: [PermissionKey.MemberRead, PermissionKey.MemberRemove],
      },
    });
    expect(rolePermissionRepository.findKeysByRoleId).toHaveBeenCalledWith(farmUser.role!.id);
  });
});
