import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import { Configuration, ConfigurationModule } from '@app/config';

import { ContextModule } from './core/context';
import { GlobalExceptionFilterProvider } from './core/filters';
import { GlobalClassSerializerInterceptorProvider } from './core/interceptors';
import { GlobalValidationPipeProvider } from './core/pipes';
import { RedisModule } from './infra/redis';
import { AttendanceModule } from './module/attendance';
import { AuthModule } from './module/auth';
import { FarmModule } from './module/farm';
import { HealthModule } from './module/health';
import { InvitationModule } from './module/invitation';
import { MeModule } from './module/me';
import { MemberModule } from './module/member';
import { PayrollModule } from './module/payroll';
import { RoleModule } from './module/role';
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
    RedisModule.forRootAsync({
      pubSub: true,
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.redisOptions;
      },
    }),
    EventEmitterModule.forRoot(),
    HealthModule,
    AuthModule,
    MeModule,
    FarmModule,
    RoleModule,
    MemberModule,
    InvitationModule,
    AttendanceModule,
    PayrollModule,
  ],
  providers: [GlobalValidationPipeProvider, GlobalExceptionFilterProvider, GlobalClassSerializerInterceptorProvider],
})
export class AppModule {}
