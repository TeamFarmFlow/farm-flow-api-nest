import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User, UserUsage } from '@app/infra/persistence/typeorm';

import { AuthUserRepositoryPort } from '../../application';
import { AuthUserDraft } from '../../domain';
import { AuthTypeOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmAuthUserRepository implements AuthUserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  hasOneByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsBy({ email });
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    return user ? AuthTypeOrmMapper.toAuthUser(user) : null;
  }

  async findOneById(id: string) {
    return AuthTypeOrmMapper.toAuthUser(await this.userRepository.findOneByOrFail({ id }));
  }

  async save(user: AuthUserDraft) {
    const savedUser = await this.userRepository.save({
      email: user.email,
      name: user.name,
      password: user.passwordHash,
      usage: new UserUsage(),
    });

    return AuthTypeOrmMapper.toAuthUser(savedUser);
  }
}
