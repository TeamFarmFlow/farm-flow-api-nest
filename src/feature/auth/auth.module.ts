import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { Configuration } from '@app/config';
import { CookieModule } from '@app/core';

import { UserModule } from '../user';

import { AuthService } from './application/auth.service';
import { RefreshTokenRepositoryProvider } from './domain';
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
  providers: [RefreshTokenRepositoryProvider, AuthService],
})
export class AuthModule {}
