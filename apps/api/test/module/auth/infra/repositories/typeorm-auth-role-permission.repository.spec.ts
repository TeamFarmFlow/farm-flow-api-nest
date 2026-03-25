import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RolePermissionEntity } from '@libs/persistence';
import { PermissionKey } from '@libs/shared';

import { TypeOrmAuthRolePermissionRepository } from '@apps/api/auth/infra';

describe('TypeOrmAuthRolePermissionRepository', () => {
  let dataSource: DataSource;
  let typeOrmAuthRolePermissionRepository: TypeOrmAuthRolePermissionRepository;

  beforeEach(() => {
    dataSource = new DataSource({ type: 'postgres' });
    typeOrmAuthRolePermissionRepository = new TypeOrmAuthRolePermissionRepository(dataSource);
  });

  it('roleId로 역할의 권한을 조회한다.', async () => {
    dataSource.getRepository = vi.fn().mockReturnValue({
      find: vi
        .fn()
        .mockResolvedValue([
          plainToInstance(RolePermissionEntity, { key: PermissionKey.FarmUpdate }),
          plainToInstance(RolePermissionEntity, { key: PermissionKey.FarmDelete }),
          plainToInstance(RolePermissionEntity, { key: PermissionKey.MemberRoleUpdate }),
        ]),
    });

    const result = await typeOrmAuthRolePermissionRepository.findKeysByRoleId('role-1');

    expect(result).toMatchObject([PermissionKey.FarmUpdate, PermissionKey.FarmDelete, PermissionKey.MemberRoleUpdate]);
  });
});
