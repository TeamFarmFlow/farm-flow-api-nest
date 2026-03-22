import { MemberRole } from '../../domain';

export interface MemberRoleRepositoryPort {
  findById(id: string): Promise<MemberRole | null>;
}
