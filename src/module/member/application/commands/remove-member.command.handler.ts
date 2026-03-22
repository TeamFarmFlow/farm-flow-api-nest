import { Inject, Injectable } from '@nestjs/common';

import { MemberNotFoundException, MemberProtectedException } from '../../domain';
import { MEMBER_FARM_USER_REPOSITORY, MemberFarmUserRepositoryPort } from '../ports';

import { RemoveMemberCommand } from './remove-member.command';

@Injectable()
export class RemoveMemberCommandHandler {
  constructor(
    @Inject(MEMBER_FARM_USER_REPOSITORY)
    private readonly memberFarmUserRepository: MemberFarmUserRepositoryPort,
  ) {}

  async execute(command: RemoveMemberCommand): Promise<void> {
    const farmUser = await this.memberFarmUserRepository.findOneWithRole(command.farmId, command.userId);

    if (!farmUser) {
      throw new MemberNotFoundException();
    }

    if (farmUser.role?.super) {
      throw new MemberProtectedException();
    }

    await this.memberFarmUserRepository.delete(command.farmId, command.userId);
  }
}
