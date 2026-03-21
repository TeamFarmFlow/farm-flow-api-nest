import { Injectable } from '@nestjs/common';

import { GetAuthContextQueryHandler } from '../queries';
import { AuthSessionResult } from '../result';
import { AuthSessionService } from '../services';

import { RefreshCommand } from './refresh.command';

@Injectable()
export class RefreshCommandHandler {
  constructor(
    private readonly authSessionService: AuthSessionService,
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
