import { Invitation } from '../../domain';

export interface InvitationStorePort {
  issue(email: string, url: string, farmId: string): Promise<Invitation>;
  get(code: string): Promise<Invitation | null>;
  revoke(code: string): Promise<void>;
}
