import { Injectable, PipeTransform } from '@nestjs/common';

import { ValidationException } from '../exceptions';

type UuidVersion = '1' | '2' | '3' | '4' | '5' | '7' | 'any';

export interface ParseUuidStringPipeOptions {
  version?: UuidVersion;
}

@Injectable()
export class ParseUuidStringPipe implements PipeTransform<string, string> {
  constructor(private readonly options: ParseUuidStringPipeOptions = {}) {}

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

    const version = this.options.version ?? '4';
    const base = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
    const anyRe = new RegExp(`^${base}$`, 'i');

    const versionMap: Record<Exclude<UuidVersion, 'any'>, RegExp> = {
      '1': /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      '2': /^[0-9a-f]{8}-[0-9a-f]{4}-2[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      '3': /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      '4': /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      '5': /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      '7': /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    };

    if (version === 'any') {
      if (!anyRe.test(value)) {
        throw new ValidationException([
          {
            property: 'id',
            constraints: { IS_UUID: `id must be a valid UUIDv${version}` },
          },
        ]);
      }

      return value;
    }

    const re = versionMap[version];

    if (!re.test(value)) {
      throw new ValidationException([
        {
          property: 'id',
          constraints: { IS_UUID: `id must be a valid UUIDv${version}` },
        },
      ]);
    }

    return value;
  }
}
