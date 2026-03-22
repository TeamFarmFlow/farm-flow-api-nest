import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

import { RedisOptions } from 'ioredis';

export type RedisModuleOptions = RedisOptions;
export type RedisModuleAsyncOptions = {
  pubSub?: boolean;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): RedisModuleOptions;
};

export const REDIS_OPTIONS = 'REDIS_OPTIONS';
export const REDIS_CLIENT = 'REDIS_CLIENT';
export const REDIS_PUBLISHER = 'REDIS_PUBLISHER';
export const REDIS_SUBSCRIBER = 'REDIS_SUBSCRIBER';
