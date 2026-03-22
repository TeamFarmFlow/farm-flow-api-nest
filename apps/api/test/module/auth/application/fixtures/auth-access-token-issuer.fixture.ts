import { vi } from 'vitest';

import { AuthAccessTokenIssuerPort } from '@apps/api/auth/application';

export const authAccessTokenIssuerFixture: AuthAccessTokenIssuerPort = {
  issue: vi.fn(),
};
