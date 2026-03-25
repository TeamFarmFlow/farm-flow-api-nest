import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@libs/http';

import { GetHealthQueryHandler } from '../application';

import { HealthResponse } from './dto/response';

@ApiTags('health')
@Public()
@Controller()
export class HealthController {
  constructor(private readonly getHealthQueryHandler: GetHealthQueryHandler) {}

  @Get()
  @ApiOkResponse({ type: HealthResponse })
  health(): HealthResponse {
    return HealthResponse.fromHealth(this.getHealthQueryHandler.execute());
  }
}
