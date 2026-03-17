import { Injectable } from '@nestjs/common';

import { UserRepository } from '@app/infra/persistence/typeorm';

import { UpdateMyProfileCommand } from './commands';

@Injectable()
export class MeService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateMyProfile(command: UpdateMyProfileCommand): Promise<void> {
    await this.userRepository.update(command.userId, { name: command.name });
  }
}
