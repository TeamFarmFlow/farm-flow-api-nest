import { describe, expect, it, vi } from 'vitest';

import { RegisterCommandHandler } from '@app/module/auth/application';
import { AuthPasswordHasherPort, AuthUserRepositoryPort } from '@app/module/auth/application/ports';
import { AuthSessionService } from '@app/module/auth/application/services';
import { AuthUser, DuplicatedEmailEXception } from '@app/module/auth/domain';
import { UserStatus } from '@app/shared/domain';

function createUser() {
  const user = new AuthUser();

  user.id = 'user-1';
  user.email = 'farmer@example.com';
  user.passwordHash = 'hashed-password';
  user.name = 'Farmer Kim';
  user.status = UserStatus.Activated;

  return user;
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

function createPasswordHasher(overrides: Partial<AuthPasswordHasherPort> = {}) {
  return {
    hash: vi.fn(),
    compare: vi.fn(),
    ...overrides,
  } satisfies AuthPasswordHasherPort;
}

function createAuthSessionService() {
  return {
    getRefreshTokenOrThrow: vi.fn(),
    issueAuthTokens: vi.fn(),
    rotateRefreshToken: vi.fn(),
    revokeRefreshToken: vi.fn(),
  } as unknown as AuthSessionService;
}

describe('RegisterCommandHandler', () => {
  it('이미 사용 중인 이메일이면 예외를 던진다', async () => {
    const userRepository = createUserRepository({
      hasOneByEmail: vi.fn().mockResolvedValue(true),
    });
    const passwordHasher = createPasswordHasher();
    const authSessionService = createAuthSessionService();
    const handler = new RegisterCommandHandler(userRepository, passwordHasher, authSessionService);

    await expect(
      handler.execute({
        email: 'farmer@example.com',
        name: 'Farmer Kim',
        password: 'plain-password',
      }),
    ).rejects.toBeInstanceOf(DuplicatedEmailEXception);
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('비밀번호를 해시하고 유저를 저장한 뒤 세션을 발급한다', async () => {
    const user = createUser();
    const userRepository = createUserRepository({
      hasOneByEmail: vi.fn().mockResolvedValue(false),
      save: vi.fn().mockResolvedValue(user),
    });
    const passwordHasher = createPasswordHasher({
      hash: vi.fn().mockResolvedValue('hashed-password'),
    });
    const authSessionService = createAuthSessionService();

    authSessionService.issueAuthTokens = vi.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const handler = new RegisterCommandHandler(userRepository, passwordHasher, authSessionService);

    await expect(
      handler.execute({
        email: 'farmer@example.com',
        name: 'Farmer Kim',
        password: 'plain-password',
      }),
    ).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user,
      farm: null,
      role: null,
    });
    expect(userRepository.save).toHaveBeenCalledWith({
      email: 'farmer@example.com',
      name: 'Farmer Kim',
      passwordHash: 'hashed-password',
    });
    expect(authSessionService.issueAuthTokens).toHaveBeenCalledWith(user.id);
  });
});
