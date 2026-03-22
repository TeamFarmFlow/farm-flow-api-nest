import { PayrollFarmUser } from '../../domain';

export interface PayrollFarmUserRepositoryPort {
  findOne(farmId: string, userId: string): Promise<PayrollFarmUser | null>;
}
