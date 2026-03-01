import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import { Configuration, ConfigurationModule } from '@app/config';
import { ContextModule, GlobalClassSerializerInterceptorProvider, GlobalExceptionFilterProvider, GlobalValidationPipeProvider } from '@app/core';

import { AuthModule } from './feature/auth';
import { HealthModule } from './feature/health';
import { UserModule } from './feature/user';

@Module({
  imports: [
    ConfigurationModule.forRoot(),
    ContextModule.forRoot(),
    WinstonModule.forRootAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.winstonModuleOptions;
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.typeormModuleOptions;
      },
    }),
    HealthModule,
    UserModule,
    AuthModule,
  ],
  providers: [GlobalValidationPipeProvider, GlobalExceptionFilterProvider, GlobalClassSerializerInterceptorProvider],
})
export class AppModule {}
