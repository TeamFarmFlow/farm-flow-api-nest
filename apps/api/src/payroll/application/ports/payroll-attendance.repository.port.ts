import { Payroll, PayrollAttendance } from '../../domain';

export interface PayrollAttendanceRepositoryPort {
  findPayrollsByFarmIdAndDateRange(farmId: string, startDate: string, endDate: string): Promise<Payroll[]>;
  findPayrollAttendancesByFarmIdAndUserIdAndDateRange(farmId: string, userId: string, startDate: string, endDate: string): Promise<PayrollAttendance[]>;
  update(id: string, farmId: string, userId: string, checkedInAt: Date, checkedOutAt: Date): Promise<void>;
  delete(id: string, farmId: string, userId: string): Promise<void>;
}
