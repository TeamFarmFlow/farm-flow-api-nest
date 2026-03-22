import { vi } from 'vitest';

import { AuthAccessTokenIssuerPort } from '@app/module/auth/application';

export const authAccessTokenIssuerFixture: AuthAccessTokenIssuerPort = {
  issue: vi.fn(),
};
