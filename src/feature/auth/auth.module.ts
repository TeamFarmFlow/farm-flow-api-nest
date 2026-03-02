import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { Configuration } from '@app/config';
import { CookieModule } from '@app/core';
import { RefreshToken, RefreshTokenRepository, TypeOrmExModule, User, UserRepository } from '@app/infra/persistence/typeorm';

import { AuthService } from './application/auth.service';
import { JwtAuthGuardProvider, JwtStrategy } from './guards';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    TypeOrmExModule.forFeature([User, RefreshToken], [UserRepository, RefreshTokenRepository]),
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
