// redis.base.ts
import { Logger } from '@nestjs/common';

import Redis, { RedisOptions } from 'ioredis';

export class BaseRedis extends Redis {
  protected readonly logger: Logger;

  constructor(name: string, options: RedisOptions) {
    super(options);

    this.logger = new Logger(name);

    this.on('connect', () => this.logger.debug('connected'));
    this.on('ready', () => this.logger.debug('ready'));
    this.on('reconnecting', (time: string) => this.logger.warn(`reconnecting in ${time}ms`));
    this.on('close', () => this.logger.warn('connection closed'));
    this.on('end', () => this.logger.warn('connection ended'));
    this.on('error', (e) => this.logger.error('error', e));
  }
}
