import { RefreshToken } from '../../domain';
import { AuthTokensResult } from '../result';

export interface AuthSessionServicePort {
  getRefreshTokenOrThrow(refreshTokenId: string): Promise<RefreshToken>;
  issueAuthTokens(userId: string, farmId: string | null): Promise<AuthTokensResult>;
  rotateRefreshToken(refreshTokenId: string, userId: string, farmId: string | null): Promise<AuthTokensResult>;
  revokeRefreshToken(refreshTokenId: string): Promise<void>;
}
