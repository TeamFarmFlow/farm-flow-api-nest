import { beforeAll, describe, expect, it } from 'vitest';

import { LogoutCommandHandler } from '@app/module/auth/application';
import { AuthSessionService } from '@app/module/auth/application/services';

import { authSessionServiceFixture } from '../fixtures/auth-session.service.fixture';

describe('LogoutCommandHandler', () => {
  let sessionService: AuthSessionService;
  let handler: LogoutCommandHandler;

  beforeAll(() => {
    sessionService = authSessionServiceFixture;
    handler = new LogoutCommandHandler(sessionService);
  });

  it('로그아웃 시 리프레시 토큰 폐기를 위임한다', async () => {
    await handler.execute({ refreshTokenId: 'refresh-token-1' });

    expect(sessionService.revokeRefreshToken).toHaveBeenCalledWith('refresh-token-1');
  });
});
