import { Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { FarmAuthGuard } from './farm-auth.guard';

export const FarmAuthGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: FarmAuthGuard,
};
