import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class FarmNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.FarmNotFound, HttpStatus.NOT_FOUND, 'Farm not found');
  }
}
