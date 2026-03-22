import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class ExceedFarmCountException extends DomainException {
  constructor() {
    super(ErrorCode.ExceedFarmCount, HttpStatus.CONFLICT, 'Exceed farm count');
  }
}
