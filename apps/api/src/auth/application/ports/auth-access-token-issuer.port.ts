export interface AuthAccessTokenIssuerPort {
  issue(userId: string, farmId?: string | null): Promise<string>;
}
