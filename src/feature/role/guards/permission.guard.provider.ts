import { Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PermissionGuard } from './permission.guard';

export const PermissionGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: PermissionGuard,
};
