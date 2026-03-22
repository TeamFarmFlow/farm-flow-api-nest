import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { Configuration } from '@app/config';
import { CookieModule } from '@app/core/cookies';

import {
  AUTH_ACCESS_TOKEN_ISSUER,
  AUTH_FARM_USER_REPOSITORY,
  AUTH_PASSWORD_HASHER,
  AUTH_REFRESH_TOKEN_STORE,
  AUTH_ROLE_PERMISSION_REPOSITORY,
  AUTH_SESSION_SERVICE,
  AUTH_USER_REPOSITORY,
  AuthSessionService,
  CheckInCommandHandler,
  GetAuthContextQueryHandler,
  LoginCommandHandler,
  LogoutCommandHandler,
  RefreshCommandHandler,
  RegisterCommandHandler,
} from './application';
import { JwtAuthGuardProvider, JwtStrategy } from './guards';
import {
  BcryptPasswordHasher,
  JwtAccessTokenIssuer,
  RedisRefreshTokenStore,
  TypeOrmAuthFarmUserRepository,
  TypeOrmAuthRolePermissionRepository,
  TypeOrmAuthUserRepository,
} from './infra';
import { AuthController, ClearAuthSessionOnInvalidTokenInterceptor } from './presentation';

@Module({
  imports: [
    CookieModule,
    JwtModule.registerAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.jwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_USER_REPOSITORY,
      useExisting: TypeOrmAuthUserRepository,
    },
    {
      provide: AUTH_FARM_USER_REPOSITORY,
      useExisting: TypeOrmAuthFarmUserRepository,
    },
    {
      provide: AUTH_ROLE_PERMISSION_REPOSITORY,
      useExisting: TypeOrmAuthRolePermissionRepository,
    },
    {
      provide: AUTH_REFRESH_TOKEN_STORE,
      useExisting: RedisRefreshTokenStore,
    },
    {
      provide: AUTH_ACCESS_TOKEN_ISSUER,
      useExisting: JwtAccessTokenIssuer,
    },
    {
      provide: AUTH_PASSWORD_HASHER,
      useExisting: BcryptPasswordHasher,
    },
    {
      provide: AUTH_SESSION_SERVICE,
      useExisting: AuthSessionService,
    },
    AuthSessionService,
    RegisterCommandHandler,
    LoginCommandHandler,
    RefreshCommandHandler,
    CheckInCommandHandler,
    LogoutCommandHandler,
    GetAuthContextQueryHandler,
    ClearAuthSessionOnInvalidTokenInterceptor,
    RedisRefreshTokenStore,
    JwtAccessTokenIssuer,
    BcryptPasswordHasher,
    TypeOrmAuthUserRepository,
    TypeOrmAuthFarmUserRepository,
    TypeOrmAuthRolePermissionRepository,
    JwtStrategy,
    JwtAuthGuardProvider,
  ],
})
export class AuthModule {}
