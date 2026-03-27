import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvalidTokenException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidToken, HttpStatus.UNAUTHORIZED, '토큰이 유효하지 않습니다.', 'Invalid token');
  }
}
