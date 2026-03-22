import { describe, expect, it, vi } from 'vitest';

import { LogoutCommandHandler } from '@app/module/auth/application';
import { AuthSessionService } from '@app/module/auth/application/services';

describe('LogoutCommandHandler', () => {
  it('로그아웃 시 리프레시 토큰 폐기를 위임한다', async () => {
    const authSessionService = {
      revokeRefreshToken: vi.fn(),
    } as unknown as AuthSessionService;
    const handler = new LogoutCommandHandler(authSessionService);

    await handler.execute({ refreshTokenId: 'refresh-token-1' });

    expect(authSessionService.revokeRefreshToken).toHaveBeenCalledWith('refresh-token-1');
  });
});
