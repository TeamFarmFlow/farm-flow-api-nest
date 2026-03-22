// redis.publisher.ts
import { Injectable } from '@nestjs/common';

import { type RedisOptions } from 'ioredis';

import { BaseRedis } from './core';

@Injectable()
export class RedisPublisher extends BaseRedis {
  constructor(options: RedisOptions) {
    super(RedisPublisher.name, options);
  }

  async publishJSON(channel: string, payload: unknown) {
    await this.publish(channel, JSON.stringify(payload));
  }
}
