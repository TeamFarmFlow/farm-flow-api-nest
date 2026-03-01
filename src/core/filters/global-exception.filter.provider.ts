import { Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './global-exception.filter';

export const GlobalExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
};
