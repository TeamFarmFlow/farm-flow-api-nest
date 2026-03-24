import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { Configuration, NodeEnv } from '@libs/config';

import { ApiModule } from './api.module';
import { setupDocumet } from './document';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });
  const configuration = app.get(Configuration);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api');
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  app.enableCors(configuration.corsOptions);
  app.use(cookieParser());

  if (configuration.nodeEnv === NodeEnv.Local) {
    setupDocumet(app);
  }

  await app.listen(configuration.listenPort, '0.0.0.0');
}

void bootstrap();
