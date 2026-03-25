import { Inject, Injectable } from '@nestjs/common';

import { MemberNotFoundException, MemberProtectedException, MemberRoleNotFoundException } from '../../domain';
import { MEMBER_FARM_USER_REPOSITORY, MEMBER_ROLE_REPOSITORY, MemberFarmUserRepositoryPort, MemberRoleRepositoryPort } from '../ports';

import { UpdateMemberRoleCommand } from './update-member-role.command';

@Injectable()
export class UpdateMemberRoleCommandHandler {
  constructor(
    @Inject(MEMBER_ROLE_REPOSITORY)
    private readonly memberRoleRepository: MemberRoleRepositoryPort,
    @Inject(MEMBER_FARM_USER_REPOSITORY)
    private readonly memberFarmUserRepository: MemberFarmUserRepositoryPort,
  ) {}

  async execute(command: UpdateMemberRoleCommand): Promise<void> {
    const farmUser = await this.memberFarmUserRepository.findOneWithRole(command.farmId, command.userId);

    if (!farmUser) {
      throw new MemberNotFoundException();
    }

    if (farmUser.role?.super) {
      throw new MemberProtectedException();
    }

    if (command.roleId) {
      const role = await this.memberRoleRepository.findById(command.roleId);

      if (!role || role.farmId !== command.farmId) {
        throw new MemberRoleNotFoundException();
      }

      if (role.super) {
        throw new MemberProtectedException();
      }
    }

    await this.memberFarmUserRepository.update(command.farmId, command.userId, {
      roleId: command.roleId,
    });
  }
}
