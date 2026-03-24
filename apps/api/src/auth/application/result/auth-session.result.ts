import { AuthResult } from './auth.result';
import { AuthTokensResult } from './auth-tokens.result';

export type AuthSessionResult = AuthResult & AuthTokensResult;
