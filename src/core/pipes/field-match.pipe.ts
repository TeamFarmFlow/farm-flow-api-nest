import { Injectable, PipeTransform } from '@nestjs/common';

import { ValidationError } from 'class-validator';

import { ValidationException } from '../exceptions';

@Injectable()
export class FieldMatchPipe<T> implements PipeTransform {
  constructor(
    private readonly key1: keyof T,
    private readonly key2: keyof T,
    private readonly errorCode = 'FIELD_MISMATCH',
  ) {}

  transform(value: unknown) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    const body = value as Record<string, unknown>;

    const key1 = this.key1 as string;
    const key2 = this.key2 as string;

    const value1 = body[key1];
    const value2 = body[key2];

    if (value1 !== undefined && value2 !== undefined && typeof value1 === typeof value2 && value1 !== value2) {
      const errors: ValidationError[] = [
        {
          property: key1,
          constraints: { [this.errorCode]: `${key1} and ${key2} do not match` },
        },
      ];

      throw new ValidationException(errors);
    }

    return value;
  }
}
