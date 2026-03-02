import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import { Configuration, ConfigurationModule } from '@app/config';

import { ContextModule } from './core/context';
import { GlobalExceptionFilterProvider } from './core/filters';
import { GlobalClassSerializerInterceptorProvider } from './core/interceptors';
import { GlobalValidationPipeProvider } from './core/pipes';
import { AuthModule } from './feature/auth';
import { FarmModule } from './feature/farm';
import { HealthModule } from './feature/health';
import { RoleModule } from './feature/role';
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
    AuthModule,
    UserModule,
    FarmModule,
    RoleModule,
  ],
  providers: [GlobalValidationPipeProvider, GlobalExceptionFilterProvider, GlobalClassSerializerInterceptorProvider],
})
export class AppModule {}
