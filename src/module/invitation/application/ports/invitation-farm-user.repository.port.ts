import { InvitationFarm } from '../../domain';

export interface InvitationFarmUserRepositoryPort {
  has(farmId: string, userId: string): Promise<boolean>;
  upsertOrIgnore(farm: InvitationFarm, userId: string, roleId: string): Promise<void>;
}
