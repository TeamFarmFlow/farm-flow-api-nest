import { vi } from 'vitest';

import { AuthSessionServicePort } from '@app/module/auth/application';

export const authSessionServiceFixture: AuthSessionServicePort = {
  getRefreshTokenOrThrow: vi.fn(),
  issueAuthTokens: vi.fn(),
  rotateRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn(),
};
