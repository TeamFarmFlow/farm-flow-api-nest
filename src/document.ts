import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Configuration } from '@config';

export function setupDocumet(app: INestApplication) {
  const configuration = app.get(Configuration);

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(configuration.appName)
        .setVersion(configuration.appVersion)
        .addBearerAuth({ type: 'http', in: 'header' }, 'authorization')
        .addSecurityRequirements('authorization')
        .build(),
    ),
  );
}
