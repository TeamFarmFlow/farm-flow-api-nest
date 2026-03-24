// redis.module.ts
import { DynamicModule, Module, Provider } from '@nestjs/common';

import { RedisOptions } from 'ioredis';

import { RedisClient } from './redis.client';
import { RedisPublisher } from './redis.publisher';
import { RedisSubscriber } from './redis.subscriber';
import { REDIS_CLIENT, REDIS_OPTIONS, REDIS_PUBLISHER, REDIS_SUBSCRIBER, RedisModuleAsyncOptions } from './types';

@Module({})
export class RedisModule {
  private static createProviders(options: RedisModuleAsyncOptions): Provider[] {
    const providers: Provider[] = [
      {
        inject: options.inject,
        provide: REDIS_OPTIONS,
        useFactory: (...args: unknown[]) => options.useFactory(...args),
      },

      {
        inject: [REDIS_OPTIONS],
        provide: REDIS_CLIENT,
        useFactory: (redisOptions: RedisOptions) => new RedisClient(redisOptions),
      },
      {
        provide: RedisClient,
        useExisting: REDIS_CLIENT,
      },
      {
        inject: [REDIS_OPTIONS],
        provide: REDIS_PUBLISHER,
        useFactory: (redisOptions: RedisOptions) => new RedisPublisher(redisOptions),
      },
      {
        provide: RedisPublisher,
        useExisting: REDIS_PUBLISHER,
      },
    ];

    if (options.pubSub) {
      providers.push(
        {
          inject: [REDIS_OPTIONS],
          provide: REDIS_SUBSCRIBER,
          useFactory: (redisOptions: RedisOptions) => new RedisSubscriber(redisOptions),
        },
        {
          provide: RedisSubscriber,
          useExisting: REDIS_SUBSCRIBER,
        },
      );
    }

    return providers;
  }

  public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const providers = this.createProviders(options);

    return {
      global: true,
      module: RedisModule,
      providers,
      exports: providers,
    };
  }
}
