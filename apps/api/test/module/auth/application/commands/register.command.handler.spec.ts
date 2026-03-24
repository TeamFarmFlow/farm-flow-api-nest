import { beforeAll, describe, expect, it, vi } from 'vitest';

import { UserStatus } from '@libs/shared';

import { AuthPasswordHasherPort, AuthSessionServicePort, AuthUserRepositoryPort, RegisterCommandHandler } from '@apps/api/auth/application';
import { DuplicatedEmailEXception } from '@apps/api/auth/domain';

import { authPasswordHasherFixture } from '../fixtures/auth-password-hasher.fixture';
import { authSessionServiceFixture } from '../fixtures/auth-session.service.fixture';
import { authUserRepositoryFixture } from '../fixtures/auth-user.repository.fixture';

describe('RegisterCommandHandler', () => {
  let userRepository: AuthUserRepositoryPort;
  let passwordHasher: AuthPasswordHasherPort;
  let sessionService: AuthSessionServicePort;
  let handler: RegisterCommandHandler;

  beforeAll(() => {
    userRepository = authUserRepositoryFixture;
    passwordHasher = authPasswordHasherFixture;
    sessionService = authSessionServiceFixture;

    handler = new RegisterCommandHandler(userRepository, passwordHasher, sessionService);
  });

  it('이미 사용 중인 이메일이면 DuplicatedEmailEXception를 던진다', async () => {
    userRepository.hasOneByEmail = vi.fn().mockResolvedValue(true);
    passwordHasher.hash = vi.fn();
    userRepository.save = vi.fn();

    await expect(
      handler.execute({
        email: 'user@example.com',
        name: 'User',
        password: 'plain-password',
      }),
    ).rejects.toBeInstanceOf(DuplicatedEmailEXception);

    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('비밀번호를 해시하고 유저를 저장한 뒤 세션을 발급한다', async () => {
    userRepository.hasOneByEmail = vi.fn().mockResolvedValue(false);
    userRepository.save = vi.fn().mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hashed-password',
      name: 'User',
      status: UserStatus.Activated,
    });

    passwordHasher.hash = vi.fn().mockResolvedValue('hashed-password');
    sessionService.issueAuthTokens = vi.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    await expect(
      handler.execute({
        email: 'user@example.com',
        name: 'User',
        password: 'plain-password',
      }),
    ).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: 'user-1',
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        name: 'User',
        status: UserStatus.Activated,
      },
      farm: null,
      role: null,
    });
    expect(userRepository.save).toHaveBeenCalledWith({
      email: 'user@example.com',
      name: 'User',
      passwordHash: 'hashed-password',
    });
    expect(sessionService.issueAuthTokens).toHaveBeenCalledWith('user-1', null);
  });
});
