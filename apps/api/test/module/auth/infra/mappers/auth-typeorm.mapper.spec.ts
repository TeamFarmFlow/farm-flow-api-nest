import { plainToInstance } from 'class-transformer';
import { describe, expect, it } from 'vitest';

import { FarmEntity, FarmUserEntity, RoleEntity, UserEntity } from '@libs/persistence';
import { UserStatus } from '@libs/shared';

import { AuthFarm, AuthFarmUser, AuthRole, AuthUser } from '@apps/api/auth/domain';
import { AuthTypeOrmMapper } from '@apps/api/auth/infra';

describe('AuthTypeOrmMapper', () => {
  it('UserEntity를 AuthUser로 변환한다.', () => {
    const user = plainToInstance<UserEntity, Partial<UserEntity>>(UserEntity, {
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed-password',
      name: 'username',
      status: UserStatus.Activated,
    });

    const authUser = AuthTypeOrmMapper.toAuthUser(user);

    expect(authUser).instanceOf(AuthUser);
    expect(authUser.passwordHash).toBe(user.password);
  });

  it('FarmEntity를 AuthFarm으로 변환한다.', () => {
    const farm = plainToInstance<FarmEntity, Partial<FarmEntity>>(FarmEntity, {
      id: 'farm-1',
      name: 'farmname',
    });

    const authFarm = AuthTypeOrmMapper.toAuthFarm(farm);

    expect(authFarm).instanceOf(AuthFarm);
  });

  it('RoleEntity를 AuthRole로 변환한다.', () => {
    const role = plainToInstance<RoleEntity, Partial<RoleEntity>>(RoleEntity, {
      permissionKeys: [],
    });

    const authRole = AuthTypeOrmMapper.toAuthRole(role);

    expect(authRole).instanceOf(AuthRole);
  });

  it('RoleEntity를 AuthRole로 변환할때 permissionKeys가 없으면 빈 배열을 매핑한다.', () => {
    const role = plainToInstance<RoleEntity, Partial<RoleEntity>>(RoleEntity, {});

    const authRole = AuthTypeOrmMapper.toAuthRole(role);

    expect(authRole).instanceOf(AuthRole);
    expect(authRole.permissionKeys).toMatchObject([]);
  });

  it('FarmUserEntity를 AuthFarmUser로 변환한다.', () => {
    const farmUser = plainToInstance<FarmUserEntity, Partial<FarmUserEntity>>(
      FarmUserEntity,
      { farm: new FarmEntity(), role: new RoleEntity() },
      { enableImplicitConversion: true, enableCircularCheck: true },
    );

    const authFarmUser = AuthTypeOrmMapper.toAuthFarmUser(farmUser);

    expect(authFarmUser).instanceOf(AuthFarmUser);
    expect(authFarmUser.farm).instanceOf(AuthFarm);
    expect(authFarmUser.role).instanceOf(AuthRole);
  });

  it('FarmUserEntity를 AuthFarmUser로 변환할때 role이 없으면 null을 매핑한다.', () => {
    const farmUser = plainToInstance<FarmUserEntity, Partial<FarmUserEntity>>(
      FarmUserEntity,
      { farm: new FarmEntity() },
      { enableImplicitConversion: true, enableCircularCheck: true },
    );

    const authFarmUser = AuthTypeOrmMapper.toAuthFarmUser(farmUser);

    expect(authFarmUser).instanceOf(AuthFarmUser);
    expect(authFarmUser.farm).instanceOf(AuthFarm);
    expect(authFarmUser.role).toEqual(null);
  });
});
