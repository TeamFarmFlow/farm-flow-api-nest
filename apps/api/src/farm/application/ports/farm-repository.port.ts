import { EntityManager } from 'typeorm';

import { Farm } from '../../domain';

export interface FarmRepositoryPort {
  save(
    farm: {
      name: string;
      payRatePerHour: number;
      payDeductionAmount: number;
    },
    em?: EntityManager,
  ): Promise<Farm>;
  update(
    id: string,
    farm: {
      name?: string;
      payRatePerHour?: number;
      payDeductionAmount?: number;
    },
    em?: EntityManager,
  ): Promise<{ affected: boolean }>;
}
