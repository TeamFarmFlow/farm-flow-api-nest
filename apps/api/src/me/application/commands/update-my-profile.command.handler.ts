import { Inject, Injectable } from '@nestjs/common';

import { ME_USER_REPOSITORY, MeUserRepositoryPort } from '../ports';

import { UpdateMyProfileCommand } from './update-my-profile.command';

@Injectable()
export class UpdateMyProfileCommandHandler {
  constructor(
    @Inject(ME_USER_REPOSITORY)
    private readonly userRepository: MeUserRepositoryPort,
  ) {}

  async execute(command: UpdateMyProfileCommand): Promise<void> {
    await this.userRepository.updateName(command.userId, command.name);
  }
}
