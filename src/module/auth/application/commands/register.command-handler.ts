import { Inject, Injectable } from '@nestjs/common';

import { DuplicatedEmailEXception } from '../../domain';
import { AUTH_PASSWORD_HASHER, AUTH_USER_REPOSITORY, AuthPasswordHasherPort, AuthUserRepositoryPort } from '../ports';
import { AuthSessionResult } from '../result';
import { AuthSessionService } from '../services';

import { RegisterCommand } from './register.command';

@Injectable()
export class RegisterCommandHandler {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly userRepository: AuthUserRepositoryPort,
    @Inject(AUTH_PASSWORD_HASHER)
    private readonly passwordHasher: AuthPasswordHasherPort,
    private readonly authSessionService: AuthSessionService,
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
    const tokens = await this.authSessionService.issueAuthTokens(user.id);

    return { ...tokens, user, farm: null, role: null };
  }
}
