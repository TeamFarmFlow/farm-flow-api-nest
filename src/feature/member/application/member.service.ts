import { Injectable } from '@nestjs/common';

import { FarmUserRepository, RoleRepository } from '@app/infra/persistence/typeorm';

import { MemberNotFoundException, MemberProtectedException, MemberRoleNotFoundException } from '../domain';

import { RemoveMemberCommand, UpdateMemberRoleCommand } from './commands';
import { GetMembersQuery } from './queries';
import { GetMembersResult } from './results';

@Injectable()
export class MemberService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly farmUserRepository: FarmUserRepository,
  ) {}

  async getMembers(query: GetMembersQuery): Promise<GetMembersResult> {
    const [rows, total] = await this.farmUserRepository.findAndCountByFarmIdWithUser(query.farmId);

    return { total, rows };
  }

  async updateMemberRole(command: UpdateMemberRoleCommand): Promise<void> {
    const farmUser = await this.farmUserRepository.findOneWithRole(command.farmId, command.userId);

    if (!farmUser) {
      throw new MemberNotFoundException();
    }

    if (farmUser.role?.super) {
      throw new MemberProtectedException();
    }

    const role = await this.roleRepository.findById(command.roleId);

    if (!role || role.farmId !== command.farmId) {
      throw new MemberRoleNotFoundException();
    }

    if (role.super) {
      throw new MemberProtectedException();
    }

    await this.farmUserRepository.update(command.farmId, command.userId, { role });
  }

  async removeMember(command: RemoveMemberCommand): Promise<void> {
    const farmUser = await this.farmUserRepository.findOneWithRole(command.farmId, command.userId);

    if (!farmUser) {
      throw new MemberNotFoundException();
    }

    if (farmUser.role?.super) {
      throw new MemberProtectedException();
    }

    await this.farmUserRepository.delete(command.farmId, command.userId);
  }
}
