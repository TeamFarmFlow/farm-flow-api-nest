import { Inject, Injectable } from '@nestjs/common';

import { AUTH_SESSION_SERVICE, AuthSessionServicePort } from '../ports';
import { GetAuthContextQueryHandler } from '../queries';
import { AuthSessionResult } from '../result';

import { CheckInCommand } from './check-in.command';

@Injectable()
export class CheckInCommandHandler {
  constructor(
    @Inject(AUTH_SESSION_SERVICE)
    private readonly authSessionService: AuthSessionServicePort,
    private readonly getAuthContextQueryHandler: GetAuthContextQueryHandler,
  ) {}

  async execute(command: CheckInCommand): Promise<AuthSessionResult> {
    await this.authSessionService.getRefreshTokenOrThrow(command.refreshTokenId);
    const auth = await this.getAuthContextQueryHandler.execute({
      userId: command.userId,
      farmId: command.farmId,
    });

    const tokens = await this.authSessionService.rotateRefreshToken(command.refreshTokenId, command.userId, command.farmId);

    return { ...auth, ...tokens };
  }
}
