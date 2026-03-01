import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Configuration } from './configuration';

@Module({})
export class ConfigurationModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: ConfigurationModule,
      imports: [ConfigModule.forRoot()],
      providers: [Configuration],
      exports: [Configuration],
    };
  }
}
