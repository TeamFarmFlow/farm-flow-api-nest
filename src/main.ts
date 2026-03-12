import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { Configuration } from './config';
import { setupDocumet } from './document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configuration = app.get(Configuration);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api');
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  app.enableCors(configuration.corsOptions);
  app.use(cookieParser());

  setupDocumet(app);

  await app.listen(configuration.listenPort, '0.0.0.0');
}

void bootstrap();
