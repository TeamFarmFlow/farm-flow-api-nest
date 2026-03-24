import { vi } from 'vitest';

import { AuthSessionServicePort } from '@apps/api/auth/application';

export const authSessionServiceFixture: AuthSessionServicePort = {
  getRefreshTokenOrThrow: vi.fn(),
  issueAuthTokens: vi.fn(),
  rotateRefreshToken: vi.fn(),
  revokeRefreshToken: vi.fn(),
};
