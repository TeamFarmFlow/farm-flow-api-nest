import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class InvalidTokenException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidToken, HttpStatus.UNAUTHORIZED, 'Invalid token');
  }
}
