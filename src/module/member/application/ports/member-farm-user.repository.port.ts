import { Member } from '../../domain';

export interface MemberFarmUserRepositoryPort {
  findAndCountByFarmIdWithUser(farmId: string): Promise<[Member[], number]>;
  findOneWithRole(farmId: string, userId: string): Promise<Member | null>;
  update(
    farmId: string,
    userId: string,
    member: {
      roleId?: string;
      payRatePerHour?: number;
      payDeductionAmount?: number;
    },
  ): Promise<void>;
  delete(farmId: string, userId: string): Promise<void>;
}
