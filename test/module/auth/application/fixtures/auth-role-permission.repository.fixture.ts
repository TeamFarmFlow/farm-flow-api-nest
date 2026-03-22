import { vi } from 'vitest';

import { AuthRolePermissionRepositoryPort } from '@app/module/auth/application';

export const authRolePermissionRepositoryFixture: AuthRolePermissionRepositoryPort = {
  findKeysByRoleId: vi.fn(),
};
