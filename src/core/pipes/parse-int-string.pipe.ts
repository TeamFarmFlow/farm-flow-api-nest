import { Injectable, PipeTransform } from '@nestjs/common';

import { ValidationException } from '../exceptions';

export interface ParseIntStringPipeOptions {
  allowZero?: boolean;
  positiveOnly?: boolean;
  allowLeadingZeros?: boolean;
}

@Injectable()
export class ParseIntStringPipe implements PipeTransform<string, string> {
  constructor(private readonly options: ParseIntStringPipeOptions = {}) {}

  transform(target: string): string {
    const value = (target ?? '').trim();

    if (value.length === 0) {
      throw new ValidationException([
        {
          property: 'id',
          constraints: { IS_NOT_EMPTY: 'id must not be empty' },
        },
      ]);
    }

    const allowLeadingZeros = this.options.allowLeadingZeros ?? false;
    const regex = allowLeadingZeros ? /^\d+$/ : /^(0|[1-9]\d*)$/;

    if (!regex.test(value)) {
      throw new ValidationException([
        {
          property: 'id',
          constraints: { IS_INT: 'id must be an integer' },
        },
      ]);
    }

    const n = BigInt(value);
    const allowZero = this.options.allowZero ?? true;
    const positiveOnly = this.options.positiveOnly ?? true;

    if (!allowZero && n === 0n) {
      throw new ValidationException([
        {
          property: 'id',
          constraints: { MIN: 'id must more than zero' },
        },
      ]);
    }

    if (positiveOnly && n < 0n) {
      throw new ValidationException([
        {
          property: 'id',
          constraints: { IS_POSITIVE: 'id must be positive' },
        },
      ]);
    }

    return value;
  }
}
