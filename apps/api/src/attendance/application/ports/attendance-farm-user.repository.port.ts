export interface AttendanceFarmUserRepositoryPort {
  getCurrentWorkDateOrFail(farmId: string, userId: string): Promise<string>;
}
