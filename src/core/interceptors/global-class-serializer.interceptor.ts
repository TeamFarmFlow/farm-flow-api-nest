import { ClassSerializerInterceptor, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { DEFAULT_TRANSFORM_OPTIONS } from '../transform';

@Injectable()
export class GlobalClassSerializerInterceptor extends ClassSerializerInterceptor {
  constructor() {
    super(new Reflector(), DEFAULT_TRANSFORM_OPTIONS);
  }
}
