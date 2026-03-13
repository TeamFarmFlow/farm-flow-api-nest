import { NestFactory } from '@nestjs/core';

import { DataSource, DataSourceOptions } from 'typeorm';

import { Configuration } from '@app/config';

import { MigrationModule } from './migration.module';

import '@app/infra/persistence/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MigrationModule);
  const configuration = app.get(Configuration);

  return new DataSource(configuration.typeormModuleOptions as DataSourceOptions);
}

export default bootstrap();
