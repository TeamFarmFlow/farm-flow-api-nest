import { vi } from 'vitest';

import { AuthRolePermissionRepositoryPort } from '@apps/api/auth/application';

export const authRolePermissionRepositoryFixture: AuthRolePermissionRepositoryPort = {
  findKeysByRoleId: vi.fn(),
};
