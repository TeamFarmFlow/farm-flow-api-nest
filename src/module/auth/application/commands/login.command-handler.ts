import { Inject, Injectable } from '@nestjs/common';

import { WrongEmailOrPasswordException } from '../../domain';
import { AUTH_PASSWORD_HASHER, AUTH_USER_REPOSITORY, AuthPasswordHasherPort, AuthUserRepositoryPort } from '../ports';
import { AuthSessionResult } from '../result';
import { AuthSessionService } from '../services';

import { LoginCommand } from './login.command';

@Injectable()
export class LoginCommandHandler {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly userRepository: AuthUserRepositoryPort,
    @Inject(AUTH_PASSWORD_HASHER)
    private readonly passwordHasher: AuthPasswordHasherPort,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async execute(command: LoginCommand): Promise<AuthSessionResult> {
    const user = await this.userRepository.findOneByEmail(command.email);

    if (!user) {
      throw new WrongEmailOrPasswordException();
    }

    if (!(await this.passwordHasher.compare(command.password, user.passwordHash))) {
      throw new WrongEmailOrPasswordException();
    }

    const tokens = await this.authSessionService.issueAuthTokens(user.id);

    return { ...tokens, user, farm: null, role: null };
  }
}
