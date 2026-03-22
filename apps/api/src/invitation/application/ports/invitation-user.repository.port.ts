import { InvitationUser } from '../../domain';

export interface InvitationUserRepositoryPort {
  findOneByEmail(email: string): Promise<InvitationUser | null>;
  findOneByIdOrFail(id: string): Promise<InvitationUser>;
}
