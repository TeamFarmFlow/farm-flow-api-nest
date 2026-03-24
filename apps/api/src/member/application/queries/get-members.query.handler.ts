import { Inject, Injectable } from '@nestjs/common';

import { MEMBER_FARM_USER_REPOSITORY, MemberFarmUserRepositoryPort } from '../ports';
import { GetMembersResult } from '../results';

import { GetMembersQuery } from './get-members.query';

@Injectable()
export class GetMembersQueryHandler {
  constructor(
    @Inject(MEMBER_FARM_USER_REPOSITORY)
    private readonly memberFarmUserRepository: MemberFarmUserRepositoryPort,
  ) {}

  async execute(query: GetMembersQuery): Promise<GetMembersResult> {
    const [rows, total] = await this.memberFarmUserRepository.findAndCountByFarmIdWithUser(query.farmId);

    return { total, rows };
  }
}
