import { RefreshToken } from '../../domain';

export interface AuthRefreshTokenStorePort {
  issue(userId: string, farmId?: string | null): Promise<string>;
  get(refreshTokenId: string): Promise<RefreshToken | null>;
  revoke(refreshTokenId: string): Promise<void>;
}
