import { Inject, Injectable } from '@nestjs/common';

import { InvalidInvitationCodeException, InvitationFarmNotFoundException } from '../../domain';
import {
  INVITATION_FARM_REPOSITORY,
  INVITATION_FARM_USER_REPOSITORY,
  INVITATION_ROLE_REPOSITORY,
  INVITATION_STORE,
  INVITATION_USER_REPOSITORY,
  InvitationFarmRepositoryPort,
  InvitationFarmUserRepositoryPort,
  InvitationRoleRepositoryPort,
  InvitationStorePort,
  InvitationUserRepositoryPort,
} from '../ports';
import { ValidateInvitationCodeResult } from '../results';

import { ValidateInvitationCodeCommand } from './validate-invitation-code.command';

@Injectable()
export class ValidateInvitationCodeCommandHandler {
  constructor(
    @Inject(INVITATION_STORE)
    private readonly invitationStore: InvitationStorePort,
    @Inject(INVITATION_USER_REPOSITORY)
    private readonly userRepository: InvitationUserRepositoryPort,
    @Inject(INVITATION_FARM_REPOSITORY)
    private readonly farmRepository: InvitationFarmRepositoryPort,
    @Inject(INVITATION_FARM_USER_REPOSITORY)
    private readonly farmUserRepository: InvitationFarmUserRepositoryPort,
    @Inject(INVITATION_ROLE_REPOSITORY)
    private readonly roleRepository: InvitationRoleRepositoryPort,
  ) {}

  async execute(command: ValidateInvitationCodeCommand): Promise<ValidateInvitationCodeResult> {
    const user = await this.userRepository.findOneByIdOrFail(command.userId);
    const invitation = await this.invitationStore.get(command.code);

    if (!invitation || invitation.email !== user.email) {
      throw new InvalidInvitationCodeException();
    }

    await this.invitationStore.revoke(command.code);

    const farm = await this.farmRepository.findOneById(invitation.farmId);

    if (!farm) {
      throw new InvitationFarmNotFoundException();
    }

    const hasFarmUser = await this.farmUserRepository.has(invitation.farmId, user.id);

    if (!hasFarmUser) {
      const defaultRoleId = await this.roleRepository.findDefaultIdOrFail(invitation.farmId);

      await this.farmUserRepository.upsertOrIgnore(farm, command.userId, defaultRoleId);
    }

    return { farmId: invitation.farmId };
  }
}
