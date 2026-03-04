import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FarmUser, FarmUserRepository, Invitation, InvitationRepository, RoleRepository } from '@app/infra/persistence/typeorm';
import { InvitationStatus } from '@app/shared/domain';

import { InvalidInvitationCodeException } from '../domain';

import { CreateInvitationCommand, ValidateInvitationCodeCommand } from './commands';
import { CreateInvitationResult, ValidateInvitationCodeResult } from './results';

@Injectable()
export class InvitationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly invitationRepository: InvitationRepository,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async createInvitation(command: CreateInvitationCommand): Promise<CreateInvitationResult> {
    const invitation = Invitation.of(command.farmId, command.userId, command.email, command.url);
    await this.invitationRepository.insert(invitation);

    return { id: invitation.id };
  }

  async validateInvitationCode(command: ValidateInvitationCodeCommand): Promise<ValidateInvitationCodeResult> {
    const invitation = await this.invitationRepository.findValidByCode(command.code);

    if (!invitation) {
      throw new InvalidInvitationCodeException();
    }

    await this.dataSource.transaction(async (em) => {
      await this.invitationRepository.update(invitation.id, { status: InvitationStatus.Accepted }, em);
      const hasFarmUser = await this.farmUserRepository.has(invitation.farmId, command.userId, em);

      if (hasFarmUser) {
        return;
      }

      const defaultRole = await this.roleRepository.findDefault(invitation.farmId, em);
      await this.farmUserRepository.insert(FarmUser.of(invitation.farmId, command.userId, defaultRole.id), em);
    });

    return { farmId: invitation.farmId };
  }
}
