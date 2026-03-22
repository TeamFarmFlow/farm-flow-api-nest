import { Inject, Injectable } from '@nestjs/common';

import { FarmNotFoundException } from '../../domain';
import { FARM_USER_REPOSITORY, FarmUserRepositoryPort } from '../ports';
import { GetFarmResult } from '../results';

import { GetFarmQuery } from './get-farm.query';

@Injectable()
export class GetFarmQueryHandler {
  constructor(
    @Inject(FARM_USER_REPOSITORY)
    private readonly farmUserRepository: FarmUserRepositoryPort,
  ) {}

  async execute(query: GetFarmQuery): Promise<GetFarmResult> {
    const farmUser = await this.farmUserRepository.findOneByFarmIdAndUserIdWithFarmAndRole(query.farmId, query.userId);

    if (!farmUser) {
      throw new FarmNotFoundException();
    }

    return farmUser.farm;
  }
}
