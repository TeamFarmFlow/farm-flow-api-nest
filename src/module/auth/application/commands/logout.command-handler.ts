import { Injectable } from '@nestjs/common';

import { AuthSessionService } from '../services';

import { LogoutCommand } from './logout.command';

@Injectable()
export class LogoutCommandHandler {
  constructor(private readonly authSessionService: AuthSessionService) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.authSessionService.revokeRefreshToken(command.refreshTokenId);
  }
}
