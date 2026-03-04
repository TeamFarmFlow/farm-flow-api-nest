import { Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';

import { MailService } from '@app/infra/mail';
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
    private readonly mailService: MailService,
  ) {}

  async createInvitation(command: CreateInvitationCommand): Promise<CreateInvitationResult> {
    const invitationEntity = Invitation.of(command.farmId, command.userId, command.email, command.url);
    await this.invitationRepository.insert(invitationEntity);
    const invitation = await this.invitationRepository.findByIdWithFarm(invitationEntity.id);

    void this.mailService
      .sendInvitationMail(invitation.email, invitation.code, invitation.url, invitation.farm.name)
      .then(() => this.invitationRepository.publishedIfPending(invitationEntity.id))
      .catch(() => this.invitationRepository.failedIfPending(invitationEntity.id));

    return { id: invitation.id };
  }

  async validateInvitationCode(command: ValidateInvitationCodeCommand): Promise<ValidateInvitationCodeResult> {
    const user = await this.userRepository.findOneById(command.userId);
    const farmId = await this.dataSource.transaction(async (em) => {
      const invitation = await this.invitationRepository.findValid(user.email, command.code, em);

      if (!invitation) {
        throw new InvalidInvitationCodeException();
      }

      const accepted = await this.invitationRepository.acceptIfPublished(invitation.id, em);

      if (accepted) {
        const defaultRole = await this.roleRepository.findDefault(invitation.farmId, em);
        await this.farmUserRepository.upsertOrIgnore(FarmUser.of(invitation.farmId, command.userId, defaultRole.id), em);
      }

      return invitation.farmId;
    });

    return { farmId };
  }
}
