import { Provider } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { GlobalValidationPipe } from './global-validation.pipe';

export const GlobalValidationPipeProvider: Provider = {
  provide: APP_PIPE,
  useClass: GlobalValidationPipe,
};
