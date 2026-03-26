import { EntityManager } from 'typeorm';

import { PayrollAttendance, PayrollTarget } from '../../domain';

export interface PayrollAttendanceRepositoryPort {
  findPayrollTargetsByFarmIdAndDateRange(farmId: string, startDate: string, endDate: string): Promise<PayrollTarget[]>;
  findPayrollTargetsByFarmIdAndUserIdAndDateRange(farmId: string, userId: string, startDate: string, endDate: string): Promise<PayrollAttendance[]>;
  findUnpayrolledByFarmIdAndUserIdAndDateRange(farmId: string, userId: string, startDate: string, endDate: string): Promise<PayrollAttendance[]>;
  update(id: string, farmId: string, userId: string, checkedInAt: Date, checkedOutAt: Date): Promise<void>;
  updatePayrolled(id: string, em: EntityManager): Promise<{ seconds: number }>;
  delete(id: string, farmId: string, userId: string): Promise<void>;
}
