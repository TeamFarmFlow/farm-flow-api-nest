import { ClassSerializerInterceptor, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GlobalClassSerializerInterceptor extends ClassSerializerInterceptor {
  constructor() {
    super(new Reflector(), {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
      enableCircularCheck: true,
      excludePrefixes: ['__'],
    });
  }
}
