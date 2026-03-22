import { EntityManager } from 'typeorm';

import { PermissionKey } from '@app/shared/domain';

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
