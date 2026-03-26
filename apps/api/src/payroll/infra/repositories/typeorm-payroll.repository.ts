import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { PayrollEntity } from '@libs/persistence';

import { PayrollRepositoryPort } from '../../application';

@Injectable()
export class TypeOrmPayrollRepository implements PayrollRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(PayrollEntity);
  }

  async insert(
    payroll: { farmId: string; userId: string; startDate: string; endDate: string; totalSeconds: number; totalPaymentAmount: number; totalDeductionAmount: number },
    em: EntityManager,
  ): Promise<void> {
    await this.getRepository(em).insert(payroll);
  }
}
