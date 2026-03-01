import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { Configuration } from '@app/config';
import { CookieModule } from '@app/core';
import { RefreshTokenRepositoryProvider } from '@app/infra/persistence/typeorm';

import { UserModule } from '../user';

import { AuthService } from './application/auth.service';
import { JwtAuthGuardProvider, JwtStrategy } from './guards';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    CookieModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.jwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [RefreshTokenRepositoryProvider, AuthService, JwtStrategy, JwtAuthGuardProvider],
})
export class AuthModule {}
