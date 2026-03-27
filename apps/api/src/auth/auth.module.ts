import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { Configuration } from '@libs/config';
import { CookieModule } from '@libs/cookie';

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
import { JwtAuthGuard, JwtStrategy } from './guards';
import {
  BcryptPasswordHasher,
  JwtAccessTokenIssuer,
  RedisRefreshTokenStore,
  TypeOrmAuthFarmUserRepository,
  TypeOrmAuthRolePermissionRepository,
  TypeOrmAuthUserRepository,
} from './infra';
import { AuthController, ClearAuthSessionOnInvalidTokenInterceptor } from './presentation';

const repositories = [TypeOrmAuthUserRepository, TypeOrmAuthFarmUserRepository, TypeOrmAuthRolePermissionRepository];
const queryHandlers = [GetAuthContextQueryHandler];
const commandHandlers = [RegisterCommandHandler, LoginCommandHandler, RefreshCommandHandler, CheckInCommandHandler, LogoutCommandHandler];

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
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
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
    JwtStrategy,
    JwtAccessTokenIssuer,
    BcryptPasswordHasher,
    RedisRefreshTokenStore,
    AuthSessionService,
    ClearAuthSessionOnInvalidTokenInterceptor,
    ...repositories,
    ...queryHandlers,
    ...commandHandlers,
  ],
})
export class AuthModule {}
