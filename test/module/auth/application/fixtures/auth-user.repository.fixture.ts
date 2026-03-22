import { vi } from 'vitest';

import { AuthUserRepositoryPort } from '@app/module/auth/application';

export const authUserRepositoryFixture: AuthUserRepositoryPort = {
  hasOneByEmail: vi.fn(),
  findOneByEmail: vi.fn(),
  findOneById: vi.fn(),
  save: vi.fn(),
};
