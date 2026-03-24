import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvalidTokenException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidToken, HttpStatus.UNAUTHORIZED, 'Invalid token');
  }
}
