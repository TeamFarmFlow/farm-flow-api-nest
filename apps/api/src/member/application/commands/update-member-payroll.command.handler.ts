import { Inject, Injectable } from '@nestjs/common';

import { MemberNotFoundException, MemberProtectedException } from '../../domain';
import { MEMBER_FARM_USER_REPOSITORY, MemberFarmUserRepositoryPort } from '../ports';

import { UpdateMemberPayrollCommand } from './update-member-payroll.command';

@Injectable()
export class UpdateMemberPayrollCommandHandler {
  constructor(
    @Inject(MEMBER_FARM_USER_REPOSITORY)
    private readonly memberFarmUserRepository: MemberFarmUserRepositoryPort,
  ) {}

  async execute(command: UpdateMemberPayrollCommand): Promise<void> {
    const farmUser = await this.memberFarmUserRepository.findOneWithRole(command.farmId, command.userId);

    if (!farmUser) {
      throw new MemberNotFoundException();
    }

    if (farmUser.role?.super) {
      throw new MemberProtectedException();
    }

    await this.memberFarmUserRepository.update(command.farmId, command.userId, {
      payRatePerHour: command.payRatePerHour,
      payDeductionAmount: command.payDeductionAmount,
    });
  }
}
