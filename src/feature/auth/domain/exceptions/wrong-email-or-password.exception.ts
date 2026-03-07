import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class WrongEmailOrPasswordException extends DomainException {
  constructor() {
    super(ErrorCode.WrongEmailOrPassword, HttpStatus.UNAUTHORIZED, 'Wrong email or password');
  }
}
