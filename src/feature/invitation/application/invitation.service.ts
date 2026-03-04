import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { FarmUser, FarmUserRepository, Invitation, InvitationRepository, RoleRepository, UserRepository } from '@app/infra/persistence/typeorm';

import { InvalidInvitationCodeException } from '../domain';

import { CreateInvitationCommand, ValidateInvitationCodeCommand } from './commands';
import { CreateInvitationResult, ValidateInvitationCodeResult } from './results';

@Injectable()
export class InvitationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async createInvitation(command: CreateInvitationCommand): Promise<CreateInvitationResult> {
    const invitation = Invitation.of(command.farmId, command.userId, command.email, command.url);
    await this.invitationRepository.insert(invitation);

    // TODO send email

    return { id: invitation.id };
  }

  async validateInvitationCode(command: ValidateInvitationCodeCommand): Promise<ValidateInvitationCodeResult> {
    const user = await this.userRepository.findOneById(command.userId);
    const farmId = await this.dataSource.transaction(async (em) => {
      const invitation = await this.invitationRepository.findValid(user.email, command.code, em);

      if (!invitation) {
        throw new InvalidInvitationCodeException();
      }

      const accepted = await this.invitationRepository.acceptIfPending(invitation.id, em);

      if (accepted) {
        const defaultRole = await this.roleRepository.findDefault(invitation.farmId, em);
        await this.farmUserRepository.upsertOrIgnore(FarmUser.of(invitation.farmId, command.userId, defaultRole.id), em);
      }

      return invitation.farmId;
    });

    return { farmId };
  }
}
