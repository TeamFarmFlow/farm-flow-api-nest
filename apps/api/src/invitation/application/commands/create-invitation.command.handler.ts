import { Inject, Injectable } from '@nestjs/common';

import { InvitationDuplicatedException, InvitationFarmNotFoundException } from '../../domain';
import {
  INVITATION_FARM_REPOSITORY,
  INVITATION_FARM_USER_REPOSITORY,
  INVITATION_MAILER,
  INVITATION_STORE,
  INVITATION_USER_REPOSITORY,
  InvitationFarmRepositoryPort,
  InvitationFarmUserRepositoryPort,
  InvitationMailerPort,
  InvitationStorePort,
  InvitationUserRepositoryPort,
} from '../ports';

import { CreateInvitationCommand } from './create-invitation.command';

@Injectable()
export class CreateInvitationCommandHandler {
  constructor(
    @Inject(INVITATION_STORE)
    private readonly invitationStore: InvitationStorePort,
    @Inject(INVITATION_USER_REPOSITORY)
    private readonly userRepository: InvitationUserRepositoryPort,
    @Inject(INVITATION_FARM_REPOSITORY)
    private readonly farmRepository: InvitationFarmRepositoryPort,
    @Inject(INVITATION_FARM_USER_REPOSITORY)
    private readonly farmUserRepository: InvitationFarmUserRepositoryPort,
    @Inject(INVITATION_MAILER)
    private readonly invitationMailer: InvitationMailerPort,
  ) {}

  async execute(command: CreateInvitationCommand): Promise<void> {
    const farm = await this.farmRepository.findOneById(command.farmId);

    if (!farm) {
      throw new InvitationFarmNotFoundException();
    }

    const user = await this.userRepository.findOneByEmail(command.email);

    if (user) {
      const hasFarmUser = await this.farmUserRepository.has(command.farmId, user.id);

      if (hasFarmUser) {
        throw new InvitationDuplicatedException();
      }
    }

    const invitation = await this.invitationStore.issue(command.email, command.url, command.farmId);

    await this.invitationMailer.sendInvitation(invitation.email, invitation.code, invitation.url, farm.name);
  }
}
