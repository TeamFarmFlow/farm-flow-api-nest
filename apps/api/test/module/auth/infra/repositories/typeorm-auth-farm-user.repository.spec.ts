import { DataSource } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthFarmUser } from '@apps/api/auth/domain';
import { TypeOrmAuthFarmUserRepository } from '@apps/api/auth/infra';

describe('TypeOrmAuthFarmUserRepository', () => {
  let dataSource: DataSource;
  let typeOrmAuthFarmUserRepository: TypeOrmAuthFarmUserRepository;

  beforeEach(() => {
    dataSource = new DataSource({ type: 'postgres' });
    typeOrmAuthFarmUserRepository = new TypeOrmAuthFarmUserRepository(dataSource);
  });

  it('farmId와 userId로 조회한 FarmUserEntity를 AuthFarmUser로 변환한다.', async () => {
    const queryBuilder = {
      innerJoinAndMapOne: vi.fn().mockReturnThis(),
      leftJoinAndMapOne: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getOne: vi.fn().mockResolvedValue({
        farm: { id: 'farm-1' },
      }),
    };

    dataSource.getRepository = vi.fn().mockReturnValue({
      createQueryBuilder: vi.fn().mockReturnValue(queryBuilder),
    });

    const result = await typeOrmAuthFarmUserRepository.findOneByFarmIdAndUserId('farm-1', 'user-1');

    expect(result).instanceOf(AuthFarmUser);
  });

  it('조회 결과가 없으면 null을 반환한다.', async () => {
    const queryBuilder = {
      innerJoinAndMapOne: vi.fn().mockReturnThis(),
      leftJoinAndMapOne: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      getOne: vi.fn().mockResolvedValue(null),
    };

    dataSource.getRepository = vi.fn().mockReturnValue({
      createQueryBuilder: vi.fn().mockReturnValue(queryBuilder),
    });

    const result = await typeOrmAuthFarmUserRepository.findOneByFarmIdAndUserId('farm-1', 'user-1');

    expect(result).toBeNull();
  });
});
