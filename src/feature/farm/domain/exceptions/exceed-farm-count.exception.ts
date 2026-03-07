import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class ExceedFarmCountException extends DomainException {
  constructor() {
    super(ErrorCode.ExceedFarmCount, HttpStatus.CONFLICT, 'Exceed farm count');
  }
}
