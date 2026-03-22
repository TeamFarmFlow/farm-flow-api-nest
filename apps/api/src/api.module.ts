import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import { Configuration, ConfigurationModule } from '@libs/config';
import { GlobalClassSerializerInterceptor, GlobalExceptionFilter, GlobalValidationPipe } from '@libs/http';
import { RedisModule } from '@libs/redis';

import { AttendanceModule } from './attendance';
import { AuthModule } from './auth';
import { ContextModule } from './context';
import { FarmModule } from './farm';
import { HealthModule } from './health';
import { InvitationModule } from './invitation';
import { MeModule } from './me';
import { MemberModule } from './member';
import { PayrollModule } from './payroll';
import { RoleModule } from './role';

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
    AttendanceModule,
    AuthModule,
    MeModule,
    FarmModule,
    RoleModule,
    MemberModule,
    InvitationModule,
    PayrollModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalClassSerializerInterceptor,
    },
  ],
})
export class ApiModule {}
