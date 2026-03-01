import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { HealthService } from '../application/health.service';

import { HealthResponse } from './dto/response';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({ type: HealthResponse })
  health(): HealthResponse {
    return HealthResponse.from(this.healthService.health());
  }
}
