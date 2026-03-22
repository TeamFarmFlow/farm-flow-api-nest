import { Injectable } from '@nestjs/common';

import { type RedisOptions } from 'ioredis';

import { BaseRedis } from './core';

@Injectable()
export class RedisClient extends BaseRedis {
  constructor(options: RedisOptions) {
    super(RedisClient.name, options);
  }

  async getJSON<T = unknown>(key: string) {
    try {
      const value = await this.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async setJSON<T = unknown>(key: string, value: T) {
    if (typeof value === 'string') {
      await this.set(key, value);
    } else {
      await this.set(key, JSON.stringify(value));
    }
  }
}
