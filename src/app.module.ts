import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration, ConfigurationModule } from './config';

@Module({
  imports: [
    ConfigurationModule.forRoot(),
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
