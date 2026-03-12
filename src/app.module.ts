import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import { Configuration, ConfigurationModule } from '@app/config';

import { ContextModule } from './core/context';
import { GlobalExceptionFilterProvider } from './core/filters';
import { GlobalClassSerializerInterceptorProvider } from './core/interceptors';
import { GlobalValidationPipeProvider } from './core/pipes';
import { AttendanceModule } from './feature/attendance';
import { AuthModule } from './feature/auth';
import { FarmModule } from './feature/farm';
import { HealthModule } from './feature/health';
import { InvitationModule } from './feature/invitation';
import { MemberModule } from './feature/member';
import { RoleModule } from './feature/role';
import { RedisModule } from './infra/redis';
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
        console.log(process.env);
        return configuration.typeormModuleOptions;
      },
    }),
    RedisModule.forRootAsync({
      pubSub: true,
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        console.log(process.env);
        return configuration.redisOptions;
      },
    }),
    EventEmitterModule.forRoot(),
    HealthModule,
    AuthModule,
    FarmModule,
    RoleModule,
    MemberModule,
    InvitationModule,
    AttendanceModule,
  ],
  providers: [GlobalValidationPipeProvider, GlobalExceptionFilterProvider, GlobalClassSerializerInterceptorProvider],
})
export class AppModule {}
