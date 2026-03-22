import { Inject, Injectable } from '@nestjs/common';

import { WrongEmailOrPasswordException } from '../../domain';
import { AUTH_PASSWORD_HASHER, AUTH_SESSION_SERVICE, AUTH_USER_REPOSITORY, AuthPasswordHasherPort, AuthSessionServicePort, AuthUserRepositoryPort } from '../ports';
import { AuthSessionResult } from '../result';

import { LoginCommand } from './login.command';

@Injectable()
export class LoginCommandHandler {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly userRepository: AuthUserRepositoryPort,
    @Inject(AUTH_PASSWORD_HASHER)
    private readonly passwordHasher: AuthPasswordHasherPort,
    @Inject(AUTH_SESSION_SERVICE)
    private readonly authSessionService: AuthSessionServicePort,
  ) {}

  async execute(command: LoginCommand): Promise<AuthSessionResult> {
    const user = await this.userRepository.findOneByEmail(command.email);

    if (!user) {
      throw new WrongEmailOrPasswordException();
    }

    if (!(await this.passwordHasher.compare(command.password, user.passwordHash))) {
      throw new WrongEmailOrPasswordException();
    }

    const tokens = await this.authSessionService.issueAuthTokens(user.id, null);

    return { ...tokens, user, farm: null, role: null };
  }
}
