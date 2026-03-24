import { vi } from 'vitest';

import { AuthRefreshTokenStorePort } from '@apps/api/auth/application';

export const authRefreshTokenStoreFixture: AuthRefreshTokenStorePort = {
  get: vi.fn(),
  issue: vi.fn(),
  revoke: vi.fn(),
};
