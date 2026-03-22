import { vi } from 'vitest';

import { AuthFarmUserRepositoryPort } from '@app/module/auth/application';

export const authFarmUserRepositoryFixture: AuthFarmUserRepositoryPort = {
  findOneByFarmIdAndUserId: vi.fn(),
};
