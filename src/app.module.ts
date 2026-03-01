import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Configuration, ConfigurationModule } from '@app/config';
import { ContextModule } from '@app/core';
import { WinstonModule } from 'nest-winston';

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
  ],
})
export class AppModule {}
