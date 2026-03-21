import { Injectable } from '@nestjs/common';

import { GetAuthContextQueryHandler } from '../queries';
import { AuthSessionResult } from '../result';
import { AuthSessionService } from '../services';

import { CheckInCommand } from './checkin.command';

@Injectable()
export class CheckInCommandHandler {
  constructor(
    private readonly authSessionService: AuthSessionService,
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
