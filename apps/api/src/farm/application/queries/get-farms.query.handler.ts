import { Inject, Injectable } from '@nestjs/common';

import { FARM_USER_REPOSITORY, FarmUserRepositoryPort } from '../ports';
import { GetFarmsResult } from '../results';

import { GetFarmsQuery } from './get-farms.query';

@Injectable()
export class GetFarmsQueryHandler {
  constructor(
    @Inject(FARM_USER_REPOSITORY)
    private readonly farmUserRepository: FarmUserRepositoryPort,
  ) {}

  async execute(query: GetFarmsQuery): Promise<GetFarmsResult> {
    const [rows, total] = await this.farmUserRepository.findAndCountByUserIdWithFarmAndRole(query.userId);

    return { total, rows };
  }
}
