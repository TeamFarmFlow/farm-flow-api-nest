import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { MailService } from '@app/infra/mail';
import { FarmRepository, FarmUser, FarmUserRepository, RoleRepository, UserRepository } from '@app/infra/persistence/typeorm';
import { RedisClient } from '@app/infra/redis';

import { InvalidInvitationCodeException, Invitation, InvitationDuplicatedException, InvitationFarmNotFoundException } from '../domain';

import { CreateInvitationCommand, ValidateInvitationCodeCommand } from './commands';
import { ValidateInvitationCodeResult } from './results';

@Injectable()
export class InvitationService {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly userRepository: UserRepository,
    private readonly farmRepository: FarmRepository,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly mailService: MailService,
  ) {}

  async createInvitation(command: CreateInvitationCommand): Promise<void> {
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

    const invitation = Invitation.of(command.email, command.url, command.farmId);
    await this.redisClient.setJSON(invitation.key(), invitation);
    await this.redisClient.expire(invitation.key(), invitation.expiresIn());
    await this.mailService.sendInvitationMail(invitation.email, invitation.code, invitation.url, farm.name);
  }

  async validateInvitationCode(command: ValidateInvitationCodeCommand): Promise<ValidateInvitationCodeResult> {
    const user = await this.userRepository.findOneById(command.userId);

    const invitationKey = Invitation.from(command.code).key();
    const invitation = plainToInstance(Invitation, await this.redisClient.getJSON(invitationKey));

    if (!invitation || invitation.email !== user.email) {
      throw new InvalidInvitationCodeException();
    }

    await this.redisClient.del(invitationKey);
    const hasFarm = await this.farmRepository.hasById(invitation.farmId);

    if (!hasFarm) {
      throw new InvitationFarmNotFoundException();
    }

    const hasFarmUser = await this.farmUserRepository.has(invitation.farmId, user.id);

    if (!hasFarmUser) {
      const defaultRole = await this.roleRepository.findDefault(invitation.farmId);
      await this.farmUserRepository.upsertOrIgnore(FarmUser.of(invitation.farmId, command.userId, defaultRole.id));
    }

    return { farmId: invitation.farmId };
  }
}
