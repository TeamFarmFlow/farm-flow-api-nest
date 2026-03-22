import { describe, expect, it, vi } from 'vitest';

import { LoginCommandHandler } from '@app/module/auth/application';
import { AuthPasswordHasherPort, AuthUserRepositoryPort } from '@app/module/auth/application/ports';
import { AuthSessionService } from '@app/module/auth/application/services';
import { AuthUser, WrongEmailOrPasswordException } from '@app/module/auth/domain';
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

describe('LoginCommandHandler', () => {
  it('사용자가 없으면 예외를 던진다', async () => {
    const userRepository = createUserRepository({
      findOneByEmail: vi.fn().mockResolvedValue(null),
    });

    const passwordHasher = createPasswordHasher();
    const authSessionService = createAuthSessionService();
    const handler = new LoginCommandHandler(userRepository, passwordHasher, authSessionService);

    await expect(handler.execute({ email: 'farmer@example.com', password: 'wrong-password' })).rejects.toBeInstanceOf(WrongEmailOrPasswordException);
    expect(passwordHasher.compare).not.toHaveBeenCalled();
  });

  it('비밀번호가 다르면 예외를 던진다', async () => {
    const userRepository = createUserRepository({
      findOneByEmail: vi.fn().mockResolvedValue(createUser()),
    });
    const passwordHasher = createPasswordHasher({
      compare: vi.fn().mockResolvedValue(false),
    });
    const authSessionService = createAuthSessionService();
    const handler = new LoginCommandHandler(userRepository, passwordHasher, authSessionService);

    await expect(handler.execute({ email: 'farmer@example.com', password: 'wrong-password' })).rejects.toBeInstanceOf(WrongEmailOrPasswordException);
    expect(authSessionService.issueAuthTokens).not.toHaveBeenCalled();
  });

  it('로그인에 성공하면 새로운 세션을 발급한다', async () => {
    const user = createUser();
    const userRepository = createUserRepository({
      findOneByEmail: vi.fn().mockResolvedValue(user),
    });

    const passwordHasher = createPasswordHasher({
      compare: vi.fn().mockResolvedValue(true),
    });

    const authSessionService = createAuthSessionService();

    authSessionService.issueAuthTokens = vi.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const handler = new LoginCommandHandler(userRepository, passwordHasher, authSessionService);

    await expect(handler.execute({ email: user.email, password: 'plain-password' })).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user,
      farm: null,
      role: null,
    });

    expect(authSessionService.issueAuthTokens).toHaveBeenCalledWith(user.id);
  });
});
