import { Inject, Injectable } from '@nestjs/common';

import { DuplicatedEmailEXception } from '../../domain';
import { AUTH_PASSWORD_HASHER, AUTH_SESSION_SERVICE, AUTH_USER_REPOSITORY, AuthPasswordHasherPort, AuthSessionServicePort, AuthUserRepositoryPort } from '../ports';
import { AuthSessionResult } from '../result';

import { RegisterCommand } from './register.command';

@Injectable()
export class RegisterCommandHandler {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly userRepository: AuthUserRepositoryPort,
    @Inject(AUTH_PASSWORD_HASHER)
    private readonly passwordHasher: AuthPasswordHasherPort,
    @Inject(AUTH_SESSION_SERVICE)
    private readonly authSessionService: AuthSessionServicePort,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthSessionResult> {
    if (await this.userRepository.hasOneByEmail(command.email)) {
      throw new DuplicatedEmailEXception();
    }

    const user = await this.userRepository.save({
      email: command.email,
      name: command.name,
      passwordHash: await this.passwordHasher.hash(command.password),
    });

    const tokens = await this.authSessionService.issueAuthTokens(user.id, null);

    return { ...tokens, user, farm: null, role: null };
  }
}
