import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Configuration, ConfigurationModule } from '@app/config';

@Module({
  imports: [
    ConfigurationModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [Configuration],
      useFactory(configuration: Configuration) {
        return configuration.typeormModuleOptions;
      },
    }),
  ],
})
export class MigrationModule {}
