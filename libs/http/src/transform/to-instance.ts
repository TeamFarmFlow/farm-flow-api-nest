import { ClassConstructor, plainToInstance } from 'class-transformer';

import { DEFAULT_TRANSFORM_OPTIONS } from './constants';

export function toInstance<T, V>(cls: ClassConstructor<T>, plain: V | V[]): T {
  return plainToInstance(cls, plain, DEFAULT_TRANSFORM_OPTIONS);
}
