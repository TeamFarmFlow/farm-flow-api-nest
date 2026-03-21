import { AuthUser, AuthUserDraft } from '../../domain';

export interface AuthUserRepositoryPort {
  hasOneByEmail(email: string): Promise<boolean>;
  findOneByEmail(email: string): Promise<AuthUser | null>;
  findOneById(id: string): Promise<AuthUser>;
  save(user: AuthUserDraft): Promise<AuthUser>;
}
