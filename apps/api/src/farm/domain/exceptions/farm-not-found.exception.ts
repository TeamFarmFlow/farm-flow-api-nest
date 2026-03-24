import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class FarmNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.FarmNotFound, HttpStatus.NOT_FOUND, 'Farm not found');
  }
}
