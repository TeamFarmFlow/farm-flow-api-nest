import { Injectable } from '@nestjs/common';

import { Configuration } from '@app/config';

import { Health } from '../../domain';

@Injectable()
export class GetHealthQueryHandler {
  constructor(private readonly configuration: Configuration) {}

  execute(): Health {
    const health = new Health();

    health.name = this.configuration.appName;
    health.version = this.configuration.appVersion;
    health.env = this.configuration.nodeEnv;

    return health;
  }
}
