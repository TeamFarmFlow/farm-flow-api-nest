import { Inject, Injectable } from '@nestjs/common';

import { AUTH_SESSION_SERVICE, AuthSessionServicePort } from '../ports';
import { GetAuthContextQueryHandler } from '../queries';
import { AuthSessionResult } from '../result';

import { RefreshCommand } from './refresh.command';

@Injectable()
export class RefreshCommandHandler {
  constructor(
    @Inject(AUTH_SESSION_SERVICE)
    private readonly authSessionService: AuthSessionServicePort,
    private readonly getAuthContextQueryHandler: GetAuthContextQueryHandler,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthSessionResult> {
    const refreshToken = await this.authSessionService.getRefreshTokenOrThrow(command.refreshTokenId);
    const auth = await this.getAuthContextQueryHandler.execute({
      userId: refreshToken.userId,
      farmId: refreshToken.farmId,
    });

    const tokens = await this.authSessionService.rotateRefreshToken(command.refreshTokenId, refreshToken.userId, refreshToken.farmId);

    return { ...auth, ...tokens };
  }
}
