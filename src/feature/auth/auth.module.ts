import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { Configuration } from '@app/config';
import { CookieModule } from '@app/core/cookies';
import {
  FarmUser,
  FarmUserRepository,
  RefreshToken,
  RefreshTokenRepository,
  RolePermission,
  RolePermissionRepository,
  TypeOrmExModule,
  User,
  UserRepository,
} from '@app/infra/persistence/typeorm';

import { AuthService } from './application';
import { JwtAuthGuardProvider, JwtStrategy } from './guards';
import { AuthController } from './presentation';

@Module({
  imports: [
    TypeOrmExModule.forFeature([User, RefreshToken, FarmUser, RolePermission], [UserRepository, RefreshTokenRepository, FarmUserRepository, RolePermissionRepository]),
    CookieModule,
    JwtModule.registerAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.jwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuardProvider],
})
export class AuthModule {}
