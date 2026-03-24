import { Module } from '@nestjs/common';

import { GetHealthQueryHandler } from './application';
import { HealthController } from './presentation/health.controller';

@Module({
  controllers: [HealthController],
  providers: [GetHealthQueryHandler],
})
export class HealthModule {}
