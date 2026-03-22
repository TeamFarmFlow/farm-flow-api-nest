import { Attendance } from '../../domain';

export interface AttendanceRepositoryPort {
  findByFarmIdAndUserIdAndDateRange(farmId: string, userId: string, startDate: string, endDate: string): Promise<[Attendance[], number]>;
  findByWorkDate(farmId: string, userId: string, workDate: string): Promise<Attendance | null>;
  findByWorkDateOrFail(farmId: string, userId: string, workDate: string): Promise<Attendance>;
  upsertCheckInByWorkDate(farmId: string, userId: string, workDate: string): Promise<void>;
  updateToCheckOutByWorkDate(farmId: string, userId: string, workDate: string): Promise<void>;
}
