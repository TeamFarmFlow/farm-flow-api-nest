import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class ExpiredTokenException extends DomainException {
  constructor() {
    super(ErrorCode.ExpiredToken, HttpStatus.UNAUTHORIZED, 'Expired token');
  }
}
