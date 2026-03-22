import { Injectable } from '@nestjs/common';

import { Configuration } from '@app/config';

import { HealthResult } from './result';

@Injectable()
export class HealthService {
  constructor(private readonly configuration: Configuration) {}

  health(): HealthResult {
    return {
      name: this.configuration.appName,
      version: this.configuration.appVersion,
      env: this.configuration.nodeEnv,
    };
  }
}
