import { ValidationPipe } from '@nestjs/common';

import { ValidationException } from '../exceptions';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory(errors) {
        return new ValidationException(errors);
      },
    });
  }
}
