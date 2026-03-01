import { Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { GlobalClassSerializerInterceptor } from './global-class-serializer.interceptor';

export const GlobalClassSerializerInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: GlobalClassSerializerInterceptor,
};
