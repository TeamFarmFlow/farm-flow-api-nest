import { vi } from 'vitest';

import { AuthSessionService } from '@app/module/auth/application';

export const authSessionServiceFixture: AuthSessionService = {
  getRefreshTokenOrThrow: vi.fn(),
  issueAuthTokens: vi.fn(),
  rotateRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn(),
} as unknown as AuthSessionService;
