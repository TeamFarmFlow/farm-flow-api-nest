import { Inject, Injectable } from '@nestjs/common';

import { AUTH_SESSION_SERVICE, AuthSessionServicePort } from '../ports';

import { LogoutCommand } from './logout.command';

@Injectable()
export class LogoutCommandHandler {
  constructor(
    @Inject(AUTH_SESSION_SERVICE)
    private readonly authSessionService: AuthSessionServicePort,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.authSessionService.revokeRefreshToken(command.refreshTokenId);
  }
}
