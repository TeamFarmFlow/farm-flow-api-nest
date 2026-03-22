import { vi } from 'vitest';

import { AuthFarmUserRepositoryPort } from '@apps/api/auth/application';

export const authFarmUserRepositoryFixture: AuthFarmUserRepositoryPort = {
  findOneByFarmIdAndUserId: vi.fn(),
};
