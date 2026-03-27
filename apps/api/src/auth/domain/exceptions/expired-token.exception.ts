import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class ExpiredTokenException extends DomainException {
  constructor() {
    super(ErrorCode.ExpiredToken, HttpStatus.UNAUTHORIZED, '토큰이 만료되었습니다.', 'Expired token');
  }
}
