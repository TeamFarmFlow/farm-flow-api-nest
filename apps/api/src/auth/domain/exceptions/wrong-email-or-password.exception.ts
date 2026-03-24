import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class WrongEmailOrPasswordException extends DomainException {
  constructor() {
    super(ErrorCode.WrongEmailOrPassword, HttpStatus.UNAUTHORIZED, 'Wrong email or password');
  }
}
