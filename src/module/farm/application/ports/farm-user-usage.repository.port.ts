import { EntityManager } from 'typeorm';

export interface FarmUserUsageRepositoryPort {
  tryIncreaseFarmCount(userId: string, em?: EntityManager): Promise<{ affected: boolean; farmCount: number }>;
  tryDecreaseFarmCount(userId: string, em?: EntityManager): Promise<{ affected: boolean; farmCount: number }>;
}
