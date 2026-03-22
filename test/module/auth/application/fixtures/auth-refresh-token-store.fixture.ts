import { vi } from 'vitest';

import { AuthRefreshTokenStorePort } from '@app/module/auth/application';

export const authRefreshTokenStoreFixture: AuthRefreshTokenStorePort = {
  get: vi.fn(),
  issue: vi.fn(),
  revoke: vi.fn(),
};
