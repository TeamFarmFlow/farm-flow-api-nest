import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthUser } from '@apps/api/auth/domain';
import { TypeOrmAuthUserRepository } from '@apps/api/auth/infra';

describe('TypeOrmAuthUserRepository', () => {
  let dataSource: DataSource;
  let typeOrmAuthUserRepository: TypeOrmAuthUserRepository;

  beforeEach(() => {
    dataSource = new DataSource({ type: 'postgres' });
    typeOrmAuthUserRepository = new TypeOrmAuthUserRepository(dataSource);
  });

  it('email이 존재하면 true를 반환한다.', async () => {
    dataSource.getRepository = vi.fn().mockReturnValue({
      existsBy: vi.fn().mockResolvedValue(true),
    });

    const result = await typeOrmAuthUserRepository.hasOneByEmail('user@example.com');

    expect(result).toEqual(true);
  });

  it('email이 존재하지 않으면 false를 반환한다.', async () => {
    dataSource.getRepository = vi.fn().mockReturnValue({
      existsBy: vi.fn().mockResolvedValue(false),
    });

    const result = await typeOrmAuthUserRepository.hasOneByEmail('user@example.com');

    expect(result).toEqual(false);
  });

  it('email의 사용자가 존재하면 AuthUser를 반환한다.', async () => {
    dataSource.getRepository = vi.fn().mockReturnValue({
      findOneBy: vi.fn().mockResolvedValue(plainToInstance(AuthUser, { email: 'user@example.com' })),
    });

    const result = await typeOrmAuthUserRepository.findOneByEmail('user@example.com');

    expect(result).toBeInstanceOf(AuthUser);
    expect(result?.email).toBe('user@example.com');
  });

  it('email의 사용자가 존재하지 않으면 null을 반환한다.', async () => {
    dataSource.getRepository = vi.fn().mockReturnValue({
      findOneBy: vi.fn().mockResolvedValue(null),
    });

    const result = await typeOrmAuthUserRepository.findOneByEmail('user@example.com');

    expect(result).toBe(null);
  });

  it('userId로 사용자를 조회한다.', async () => {
    dataSource.getRepository = vi.fn().mockReturnValue({
      findOneByOrFail: vi.fn().mockResolvedValue(plainToInstance(AuthUser, { id: 'user-1' })),
    });

    const result = await typeOrmAuthUserRepository.findOneById('user-1');

    expect(result).toBeInstanceOf(AuthUser);
  });

  it('사용자의 정보가 저장되면 AuthUser를 반환한다.', async () => {
    dataSource.getRepository = vi.fn().mockReturnValue({
      save: vi.fn().mockResolvedValue(plainToInstance(AuthUser, { email: 'user@example.com' })),
    });

    const result = await typeOrmAuthUserRepository.save({
      email: 'user@example.com',
      name: 'User',
      passwordHash: 'hashed-password',
    });

    expect(result).toBeInstanceOf(AuthUser);
  });
});
