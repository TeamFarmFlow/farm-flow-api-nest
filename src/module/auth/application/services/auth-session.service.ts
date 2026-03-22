import { Inject, Injectable } from '@nestjs/common';

import { InvalidTokenException, RefreshToken } from '../../domain';
import { AUTH_ACCESS_TOKEN_ISSUER, AUTH_REFRESH_TOKEN_STORE, AuthAccessTokenIssuerPort, AuthRefreshTokenStorePort, AuthSessionServicePort } from '../ports';
import { AuthTokensResult } from '../result';

@Injectable()
export class AuthSessionService implements AuthSessionServicePort {
  constructor(
    @Inject(AUTH_REFRESH_TOKEN_STORE)
    private readonly refreshTokenStore: AuthRefreshTokenStorePort,
    @Inject(AUTH_ACCESS_TOKEN_ISSUER)
    private readonly accessTokenIssuer: AuthAccessTokenIssuerPort,
  ) {}

  async getRefreshTokenOrThrow(refreshTokenId: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokenStore.get(refreshTokenId);

    if (!refreshToken) {
      throw new InvalidTokenException();
    }

    return refreshToken;
  }

  async issueAuthTokens(userId: string, farmId: string | null): Promise<AuthTokensResult> {
    return {
      accessToken: await this.accessTokenIssuer.issue(userId, farmId),
      refreshToken: await this.refreshTokenStore.issue(userId, farmId),
    };
  }

  async rotateRefreshToken(refreshTokenId: string, userId: string, farmId: string | null): Promise<AuthTokensResult> {
    await this.refreshTokenStore.revoke(refreshTokenId);

    return this.issueAuthTokens(userId, farmId);
  }

  async revokeRefreshToken(refreshTokenId: string): Promise<void> {
    await this.refreshTokenStore.revoke(refreshTokenId);
  }
}
