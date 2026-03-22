import { beforeAll, describe, expect, it, vi } from 'vitest';

import { LoginCommandHandler } from '@app/module/auth/application';
import { AuthPasswordHasherPort, AuthUserRepositoryPort } from '@app/module/auth/application/ports';
import { AuthSessionService } from '@app/module/auth/application/services';
import { AuthUser, WrongEmailOrPasswordException } from '@app/module/auth/domain';
import { BcryptPasswordHasher } from '@app/module/auth/infra';
import { UserStatus } from '@app/shared/domain';

import { authSessionServiceFixture } from '../fixtures/auth-session.service.fixture';
import { authUserRepositoryFixture } from '../fixtures/auth-user.repository.fixture';

describe('LoginCommandHandler', () => {
  let userRepository: AuthUserRepositoryPort;
  let passwordHasher: AuthPasswordHasherPort;
  let sessionService: AuthSessionService;
  let handler: LoginCommandHandler;

  beforeAll(() => {
    userRepository = authUserRepositoryFixture;
    sessionService = authSessionServiceFixture;
    passwordHasher = new BcryptPasswordHasher();

    handler = new LoginCommandHandler(userRepository, passwordHasher, sessionService);
  });

  it('사용자가 없으면 예외를 던진다', async () => {
    userRepository.findOneByEmail = vi.fn().mockResolvedValue(null);

    await expect(
      handler.execute({
        email: 'user@example.com',
        password: 'hashed-password',
      }),
    ).rejects.toBeInstanceOf(WrongEmailOrPasswordException);
  });

  it('비밀번호가 다르면 예외를 던진다', async () => {
    userRepository.findOneByEmail = vi.fn().mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: '$2b$10$ypDhALo3O7UUnq44PJfapOhsY13n8ZuZ8zbUUI99PvGn9PGpmVG9O',
      name: 'User',
      status: UserStatus.Activated,
    });

    await expect(
      handler.execute({
        email: 'user@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(WrongEmailOrPasswordException);
  });

  it('로그인에 성공하면 새로운 세션을 발급한다', async () => {
    const user: AuthUser = {
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: '$2b$10$ypDhALo3O7UUnq44PJfapOhsY13n8ZuZ8zbUUI99PvGn9PGpmVG9O',
      name: 'User',
      status: UserStatus.Activated,
    };

    userRepository.findOneByEmail = vi.fn().mockResolvedValue(user);
    sessionService.issueAuthTokens = vi.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    await expect(handler.execute({ email: user.email, password: 'hashed-password' })).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user,
      farm: null,
      role: null,
    });

    expect(sessionService.issueAuthTokens).toHaveBeenCalledWith(user.id);
  });
});
