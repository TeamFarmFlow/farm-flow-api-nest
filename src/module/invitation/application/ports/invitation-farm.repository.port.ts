import { InvitationFarm } from '../../domain';

export interface InvitationFarmRepositoryPort {
  findOneById(id: string): Promise<InvitationFarm | null>;
}
