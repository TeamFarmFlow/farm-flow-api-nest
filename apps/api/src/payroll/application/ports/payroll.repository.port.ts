import { EntityManager } from 'typeorm';

export interface PayrollRepositoryPort {
  insert(
    payroll: {
      farmId: string;
      userId: string;
      startDate: string;
      endDate: string;
      totalSeconds: number;
      totalPaymentAmount: number;
      totalDeductionAmount: number;
    },
    em: EntityManager,
  ): Promise<void>;
}
