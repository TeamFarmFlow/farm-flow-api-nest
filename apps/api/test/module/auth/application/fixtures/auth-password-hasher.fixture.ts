import { vi } from 'vitest';

import { AuthPasswordHasherPort } from '@apps/api/auth/application';

export const authPasswordHasherFixture: AuthPasswordHasherPort = {
  hash: vi.fn(),
  compare: vi.fn(),
};
