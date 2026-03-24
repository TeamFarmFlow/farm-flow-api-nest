import { EntityManager } from 'typeorm';

import { PermissionKey } from '@libs/shared';

import { FarmRole } from '../../domain';

export interface FarmRoleRepositoryPort {
  save(
    role: {
      farmId: string;
      name: string;
      required: boolean;
      super: boolean;
      permissionKeys: PermissionKey[];
    },
    em?: EntityManager,
  ): Promise<FarmRole>;
}
