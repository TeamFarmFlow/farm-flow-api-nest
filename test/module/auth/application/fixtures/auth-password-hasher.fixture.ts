import { vi } from 'vitest';

import { AuthPasswordHasherPort } from '@app/module/auth/application';

export const authPasswordHasherFixture: AuthPasswordHasherPort = {
  hash: vi.fn(),
  compare: vi.fn(),
};
